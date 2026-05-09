// js/views/focus.js — Deep work mode with Pomodoro

import {
  getState, toggleTask, getLevelInfo, getProgressStats,
  getSkillStats, getWeeklyData, getDailyLog, getTodayCount
} from '../store.js';
import { getTodayTasks, showXPFloat, checkBadges, showToast } from '../gamification.js';

// ── Module-level: survives view navigation ──
let _mode       = 'work';   // 'work' | 'short' | 'long'
let _running    = false;
let _timeLeft   = 25 * 60; // seconds remaining
let _totalTime  = 25 * 60; // seconds of current interval
let _startEpoch = null;    // Date.now() when last unpaused
let _animId     = null;    // requestAnimationFrame id
let _workDur    = 25;      // 25 | 50 | 90
let _cyclePos   = 0;       // 0-3: which of the 4 pomodoros we're on
let _sessToday  = 0;       // work sessions completed today (resets on page reload)
let _focusMins  = 0;       // total focused minutes today

const CIRC = 2 * Math.PI * 45; // SVG r=45 → ≈282.74

const MODES = {
  work:  {
    label: 'Focus Session',
    color: 'var(--primary)',
    glowColor: 'var(--primary-glow)',
    shellClass: 'mode-work'
  },
  short: {
    label: 'Short Break',
    color: 'var(--accent)',
    glowColor: 'hsla(162,76%,48%,.32)',
    shellClass: 'mode-short'
  },
  long:  {
    label: 'Long Break',
    color: 'var(--sky)',
    glowColor: 'hsla(200,88%,60%,.32)',
    shellClass: 'mode-long'
  }
};

function _modeDuration(mode) {
  if (mode === 'work')  return _workDur * 60;
  if (mode === 'short') return 5 * 60;
  return 15 * 60;
}

const MESSAGES = {
  work: [
    'Block out the world. Just this task.',
    'One task at a time. That is all.',
    'Code. Think. Build. Repeat.',
    'Deep work is a skill. Practice it.',
    'No notifications. No distractions.',
    'Every minute counts toward ₹20 LPA.',
    'The people who win do this every day.',
  ],
  short: [
    'Good work. Step away.',
    'Rest your eyes for 5 minutes.',
    'Hydrate. Stretch. Breathe.',
    'You earned this. Come back strong.',
    'Short rest, long focus.',
  ],
  long: [
    '15 minutes. Actually rest.',
    'Walk away from the screen.',
    'Great cycle. You showed up.',
    'Recharge completely. The work will wait.',
  ]
};

function _getMsg(mode) {
  const arr = MESSAGES[mode];
  // Rotate based on current minute so it changes meaningfully
  return arr[Math.floor(Date.now() / 60000) % arr.length];
}

export function render(months) {
  return `
<div class="view-focus">

  <!-- ── POMODORO CARD ── -->
  <div class="pomo-shell mode-${_mode}" id="pomo-shell">

    <!-- Top row: label left, session dots right -->
    <div class="pomo-header-row">
      <span class="pomo-header-label" id="pomo-phase-label">${_mode === 'work' ? 'FOCUS SESSION' : (_mode === 'short' ? 'SHORT BREAK' : 'LONG BREAK')}</span>
      <div class="pomo-dots" id="pomo-dots">
        <!-- 4 dots rendered by JS in mount() -->
        <div class="pomo-dot" id="pdot-0"></div>
        <div class="pomo-dot" id="pdot-1"></div>
        <div class="pomo-dot" id="pdot-2"></div>
        <div class="pomo-dot" id="pdot-3"></div>
      </div>
    </div>

    <!-- Ring container (position:relative for ambient layer) -->
    <div class="pomo-ring-wrap">

      <!-- Ambient breathing ring: always behind the SVG -->
      <div class="pomo-ambient" id="pomo-ambient"></div>

      <!-- The actual SVG ring -->
      <svg class="pomo-svg" viewBox="0 0 100 100">
        <!-- Static grey track -->
        <circle class="pomo-track" cx="50" cy="50" r="45"/>
        <!-- Progress arc: stroke-dashoffset controlled by JS -->
        <circle class="pomo-arc" id="pomo-arc"
                cx="50" cy="50" r="45"
                stroke-dasharray="${CIRC}"
                stroke-dashoffset="0"/>
        <!-- Time text: centered in circle -->
        <text class="pomo-time-text" id="pomo-time-text"
              x="50" y="45">25:00</text>
        <!-- Mode sub-label below time -->
        <text class="pomo-mode-text" id="pomo-mode-text"
              x="50" y="60">Focus Session</text>
      </svg>
    </div>

    <!-- Motivational message -->
    <p class="pomo-msg" id="pomo-msg">Block out the world. Just this task.</p>

    <!-- Duration selector (work mode only — hidden during breaks) -->
    <div class="pomo-dur-row" id="pomo-dur-row">
      <button class="pomo-dur-btn active" data-min="25">25 min</button>
      <button class="pomo-dur-btn" data-min="50">50 min</button>
      <button class="pomo-dur-btn" data-min="90">90 min</button>
    </div>

    <!-- Main controls: reset | PLAY | skip -->
    <div class="pomo-controls">
      <button class="pomo-ctrl pomo-ctrl-side" id="pomo-reset" title="Reset (R)">
        <i data-lucide="rotate-ccw"></i>
      </button>
      <button class="pomo-ctrl pomo-ctrl-main" id="pomo-toggle" title="Start/Pause (Space)">
        <i data-lucide="play" id="pomo-play-icon"></i>
      </button>
      <button class="pomo-ctrl pomo-ctrl-side" id="pomo-skip" title="Skip to next phase (S)">
        <i data-lucide="skip-forward"></i>
      </button>
    </div>

    <!-- Mode tabs: focus | short break | long break -->
    <div class="pomo-tabs">
      <button class="pomo-tab active" data-mode="work">Focus</button>
      <button class="pomo-tab" data-mode="short">Short Break</button>
      <button class="pomo-tab" data-mode="long">Long Break</button>
    </div>

    <!-- Today's stats row -->
    <div class="pomo-stats-row">
      <div class="pomo-stat">
        <span class="pomo-stat-val" id="stat-sess">0</span>
        <span class="pomo-stat-lbl">sessions today</span>
      </div>
      <div class="pomo-stat-sep"></div>
      <div class="pomo-stat">
        <span class="pomo-stat-val" id="stat-mins">0</span>
        <span class="pomo-stat-lbl">min focused</span>
      </div>
      <div class="pomo-stat-sep"></div>
      <div class="pomo-stat">
        <span class="pomo-stat-val" id="stat-cycle">1/4</span>
        <span class="pomo-stat-lbl">in cycle</span>
      </div>
    </div>

    <!-- Keyboard shortcuts hint -->
    <div class="pomo-kbd">
      <kbd>Space</kbd> play/pause &nbsp;·&nbsp;
      <kbd>R</kbd> reset &nbsp;·&nbsp;
      <kbd>S</kbd> skip
    </div>

  </div><!-- /pomo-shell -->

  <!-- ── TASKS SECTION ── -->
  <div class="pomo-tasks">
    <div class="pomo-tasks-header">
      <h3 class="section-title">
        <i data-lucide="list-checks" style="width:16px;height:16px;margin-right:6px;vertical-align:-2px;"></i>
        Today's Priority Tasks
      </h3>
      <a href="#roadmap" class="pomo-all-link">Full roadmap →</a>
    </div>
    <div class="card card-sm" id="focus-task-list">
      <!-- task rows rendered here -->
    </div>
  </div>

</div><!-- /view-focus -->
`;
}

export function mount(months) {
  const shell = document.getElementById('pomo-shell');

  function _syncUI() {
    const cfg = MODES[_mode];

    // 1. SVG time text
    const m = Math.floor(_timeLeft / 60);
    const s = _timeLeft % 60;
    const timeText = document.getElementById('pomo-time-text');
    if (timeText) {
        timeText.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    // 2. SVG arc offset
    const progress = _timeLeft / _totalTime;  // 1 = full, 0 = empty
    const offset   = CIRC * (1 - progress);
    const arc      = document.getElementById('pomo-arc');
    if (arc) {
        arc.style.strokeDashoffset = offset;
        arc.style.stroke = cfg.color;
    }

    // 3. Mode text inside SVG
    const modeText = document.getElementById('pomo-mode-text');
    if (modeText) modeText.textContent = cfg.label;

    // 4. Shell background class
    if (shell) shell.className = `pomo-shell mode-${_mode}`;

    // 5. Phase label (top-left of card)
    const labels = { work:'FOCUS SESSION', short:'SHORT BREAK', long:'LONG BREAK' };
    const phaseLabel = document.getElementById('pomo-phase-label');
    if (phaseLabel) phaseLabel.textContent = labels[_mode];

    // 6. Ambient ring: only breathe when running
    const ambient = document.getElementById('pomo-ambient');
    if (ambient) {
      ambient.classList.toggle('is-active', _running);
      ambient.classList.toggle('is-break', _mode !== 'work');
    }

    // 7. Play/pause icon
    const icon = document.getElementById('pomo-play-icon');
    if (icon) {
      icon.setAttribute('data-lucide', _running ? 'pause' : 'play');
    }
    // Play button color (break vs work)
    const mainBtn = document.getElementById('pomo-toggle');
    if (mainBtn) {
      mainBtn.classList.toggle('break-mode', _mode !== 'work');
    }

    // 8. Session dots
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`pdot-${i}`);
      if (!dot) continue;
      dot.className = 'pomo-dot';
      if (i < _cyclePos)  dot.classList.add('done');   // past sessions
      if (i === _cyclePos && _mode === 'work') dot.classList.add('active'); // current
    }

    // 9. Stats row
    const ss = document.getElementById('stat-sess');
    const sm = document.getElementById('stat-mins');
    const sc = document.getElementById('stat-cycle');
    if (ss) ss.textContent = _sessToday;
    if (sm) sm.textContent = _focusMins;
    if (sc) sc.textContent = `${_cyclePos + 1}/4`;

    // 10. Duration row: hide during break modes
    const durRow = document.getElementById('pomo-dur-row');
    if (durRow) durRow.classList.toggle('hidden', _mode !== 'work');

    // 11. Browser tab title when running
    if (_running) {
      const min = String(Math.floor(_timeLeft/60)).padStart(2,'0');
      const sec = String(_timeLeft%60).padStart(2,'0');
      document.title = `${min}:${sec} — ${cfg.label} · Career OS`;
    } else {
      document.title = 'Career OS';
    }

    // Re-init lucide icons after changing data-lucide attributes
    if (window.lucide) window.lucide.createIcons();
  }

  function _tick() {
    if (!_running) return;
    const elapsed  = Math.floor((Date.now() - _startEpoch) / 1000);
    const newLeft  = Math.max(0, _totalTime - elapsed);
    if (newLeft !== _timeLeft) {
      _timeLeft = newLeft;
      _syncUI();
      if (_timeLeft === 0) { _onComplete(); return; }
    }
    _animId = requestAnimationFrame(_tick);
  }

  function _onComplete() {
    _running = false;
    cancelAnimationFrame(_animId);
    document.title = 'Career OS';

    if (_mode === 'work') {
      // Completed a focus session
      _sessToday++;
      _focusMins += _workDur;
      _cyclePos = (_cyclePos + 1) % 4;

      // Play ascending 3-note chord: C5 E5 G5
      _playTone([523, 659, 784]);

      // Flash the shell
      if (shell) {
          shell.classList.add('flash');
          setTimeout(() => shell.classList.remove('flash'), 800);
      }

      const nextBreak = _cyclePos === 0 ? 'long' : 'short';
      const breakLabel = nextBreak === 'long' ? '15-min long break' : '5-min short break';
      showToast(`Session complete! Starting ${breakLabel}.`, 'flame');

      // Auto-advance to break after 1.5s
      setTimeout(() => _setMode(nextBreak), 1500);

    } else {
      // Completed a break
      _playTone([659, 523]);  // E5 C5 — descending, gentle

      if (shell) {
          shell.classList.add('flash-break');
          setTimeout(() => shell.classList.remove('flash-break'), 800);
      }

      showToast('Break over. Back to work!', 'target');
      setTimeout(() => _setMode('work'), 1500);
    }

    _syncUI();
  }

  function _playTone(freqs) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.45);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.5);
      });
    } catch (e) {}
  }

  function _toggle() {
    if (_running) {
      // Pause: save remaining time
      _running    = false;
      _totalTime  = _timeLeft;
      _startEpoch = null;
      cancelAnimationFrame(_animId);
    } else {
      // Resume or start fresh
      _running    = true;
      _startEpoch = Date.now();
      // If paused mid-session, start from _timeLeft
      _animId = requestAnimationFrame(_tick);
    }
    _syncUI();
  }

  function _reset() {
    _running    = false;
    _startEpoch = null;
    cancelAnimationFrame(_animId);
    _timeLeft   = _modeDuration(_mode);
    _totalTime  = _timeLeft;
    document.title = 'Career OS';
    _syncUI();
  }

  function _skip() {
    _running = false;
    _startEpoch = null;
    cancelAnimationFrame(_animId);
    document.title = 'Career OS';
    if (_mode === 'work') {
      _cyclePos = (_cyclePos + 1) % 4;
      _setMode(_cyclePos === 0 ? 'long' : 'short');
    } else {
      _setMode('work');
    }
  }

  function _setMode(mode) {
    _mode       = mode;
    _running    = false;
    _startEpoch = null;
    cancelAnimationFrame(_animId);
    _timeLeft   = _modeDuration(mode);
    _totalTime  = _timeLeft;
    document.title = 'Career OS';

    // Update tab active states
    document.querySelectorAll('.pomo-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update duration buttons if work mode
    if (mode === 'work') {
      document.querySelectorAll('.pomo-dur-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.min) === _workDur);
      });
    }

    _syncUI();
  }

  function _setWorkDur(min) {
    _workDur = min;
    if (_mode === 'work' && !_running) {
      _timeLeft  = min * 60;
      _totalTime = _timeLeft;
    }
    document.querySelectorAll('.pomo-dur-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.min) === min);
    });
    _syncUI();
  }

  // Controls
  document.getElementById('pomo-toggle')?.addEventListener('click', _toggle);
  document.getElementById('pomo-reset')?.addEventListener('click',  _reset);
  document.getElementById('pomo-skip')?.addEventListener('click',   _skip);

  // Mode tabs
  document.querySelectorAll('.pomo-tab').forEach(btn => {
    btn.addEventListener('click', () => _setMode(btn.dataset.mode));
  });

  // Duration buttons
  document.querySelectorAll('.pomo-dur-btn').forEach(btn => {
    btn.addEventListener('click', () => _setWorkDur(parseInt(btn.dataset.min)));
  });

  // Keyboard shortcuts — global, but only when no input is focused
  function _onKey(e) {
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.code === 'Space') { e.preventDefault(); _toggle(); }
    if (e.key  === 'r' || e.key === 'R') _reset();
    if (e.key  === 's' || e.key === 'S') _skip();
  }
  document.addEventListener('keydown', _onKey);

  // Cleanup on navigation away (fires once)
  window.addEventListener('hashchange', () => {
    document.removeEventListener('keydown', _onKey);
    document.title = 'Career OS';
  }, { once: true });

  let _msgInterval = null;
  function _startMsgRotation() {
    _msgInterval = setInterval(() => {
      if (!_running) return;
      const msg = document.getElementById('pomo-msg');
      if (!msg) { clearInterval(_msgInterval); return; }
      msg.classList.add('fade');
      setTimeout(() => {
        msg.textContent = _getMsg(_mode);
        msg.classList.remove('fade');
      }, 400);
    }, 12000);
  }
  _startMsgRotation();

  window.addEventListener('hashchange', () => {
    clearInterval(_msgInterval);
  }, { once: true });

  // Build today's task list inside #focus-task-list
  const taskListEl = document.getElementById('focus-task-list');
  if (taskListEl) {
    const tasks = getTodayTasks(months, 6);
    if (!tasks.length) {
      taskListEl.innerHTML = `
        <div class="empty-state" style="padding:var(--s10);">
          <div class="empty-state-icon">
            <i data-lucide="check-circle" style="width:40px;height:40px;color:var(--accent);opacity:0.5;"></i>
          </div>
          <div class="empty-state-title">All caught up!</div>
          <div class="empty-state-desc">No pending tasks for today. Check the full roadmap.</div>
        </div>`;
    } else {
      taskListEl.innerHTML = tasks.map(t => {
        const done = !!getState().checked[t.id];
        return `
          <div class="task-row focus-task${done?' task-done':''}"
               data-id="${t.id}" data-xp="${t.task.xp||10}"
               style="${done?'opacity:0.45':''}">
            <div class="task-check${done?' done':''}" id="fchk-${t.id}">
              ${done?'<i data-lucide="check" style="width:13px;height:13px;"></i>':''}
            </div>
            <div class="task-info" style="flex:1;min-width:0;">
              <div class="task-name${done?' done':''}" id="fnm-${t.id}">${t.task.t}</div>
              <div class="task-sub" style="margin-top:2px;">
                ${t.monthTitle}
                <span class="skill-badge skill-${t.skill}"
                      style="font-size:9px;padding:1px 7px;margin-left:4px;">${t.skill}</span>
              </div>
            </div>
            <div class="task-xp">+${t.task.xp||10}</div>
          </div>`;
      }).join('');

      document.querySelectorAll('.focus-task').forEach(row => {
        row.addEventListener('click', () => {
          const id  = row.dataset.id;
          const xpv = parseInt(row.dataset.xp) || 10;
          toggleTask(id, xpv);
          showXPFloat(row, xpv);
          checkBadges(months);
          const done = !!getState().checked[id];
          const chk  = document.getElementById('fchk-' + id);
          const nm   = document.getElementById('fnm-'  + id);
          if (chk) {
            chk.className = 'task-check' + (done ? ' done' : '');
            chk.innerHTML = done ? '<i data-lucide="check" style="width:13px;height:13px;"></i>' : '';
          }
          if (nm)  nm.className = 'task-name' + (done ? ' done' : '');
          row.style.opacity = done ? '0.45' : '1';
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }
  }

  // Initial render
  _syncUI();
  if (window.lucide) window.lucide.createIcons();

  // If was running before navigation, resume
  if (_running) _animId = requestAnimationFrame(_tick);
}
