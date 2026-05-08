// js/views/focus.js — Deep work mode with Pomodoro

import { getState, toggleTask } from '../store.js';
import { getTodayTasks, showXPFloat, checkBadges, showToast } from '../gamification.js';

let _timerId = null;
let _timeLeft = 25 * 60; // 25 min default
let _timerRunning = false;
let _totalTime = 25 * 60;
let _startTime = null;
let _mode = 'work'; // 'work' or 'break'

const MODES = {
  work: { label: 'Focus Session', time: 25 * 60, color: 'var(--primary)' },
  short: { label: 'Short Break', time: 5 * 60, color: 'var(--accent)' },
  long: { label: 'Long Break', time: 15 * 60, color: 'var(--sky)' }
};

export function render(months) {
  const tasks = getTodayTasks(months, 5);

  const tasksHtml = tasks.length
    ? tasks.map(t => {
        const s = getState();
        const done = !!s.checked[t.id];
        return `
        <div class="task-row focus-task" data-id="${t.id}" data-xp="${t.task.xp||10}" style="${done?'opacity:0.5':''}">
          <div class="task-check ${done?'done':''}" id="fchk-${t.id}">${done?'<i data-lucide="check" style="width:14px;height:14px;"></i>':''}</div>
          <div class="task-info">
            <div class="task-name ${done?'done':''}" id="fnm-${t.id}" style="font-size:16px;">${t.task.t}</div>
            <div class="task-sub">${t.monthTitle} · ${t.skill}</div>
          </div>
          <div class="task-xp" style="font-size:14px;">+${t.task.xp||10} XP</div>
        </div>`;
      }).join('')
    : `<div class="empty-state"><div class="empty-state-icon"><i data-lucide="check-circle"></i></div><div class="empty-state-title">No tasks pending</div><div class="empty-state-desc">You are all caught up for today. Take a break!</div></div>`;

  return `
<div class="view-focus" style="max-width:700px;margin:0 auto;text-align:center;padding: var(--s8) var(--s4);">
  <div class="pomodoro-container">
    <div class="pomo-mode-badge" id="pomo-mode-label">Focus Session</div>
    
    <div class="pomodoro-circle">
      <svg class="pomo-svg" viewBox="0 0 100 100">
        <circle class="pomo-bg" cx="50" cy="50" r="45"></circle>
        <circle class="pomo-fill" id="pomo-fill" cx="50" cy="50" r="45"></circle>
      </svg>
      <div class="pomo-time" id="pomo-time">25:00</div>
    </div>

    <div class="pomo-controls">
      <button class="pomo-btn" id="pomo-toggle" title="Start/Pause">
        <i data-lucide="play" id="pomo-icon"></i>
      </button>
      <button class="pomo-btn pomo-btn-secondary" id="pomo-reset" title="Reset">
        <i data-lucide="rotate-ccw"></i>
      </button>
    </div>

    <div class="pomo-modes">
      <button class="pomo-mode-btn active" data-mode="work">Focus</button>
      <button class="pomo-mode-btn" data-mode="short">Short Break</button>
      <button class="pomo-mode-btn" data-mode="long">Long Break</button>
    </div>
  </div>

  <div style="text-align:left; margin-top:var(--s12);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--s4);">
      <h3 style="margin:0; font-size:18px; color:var(--tx);">Current Focus</h3>
      <span style="font-size:12px; color:var(--tx-3);">PRIORITY TASKS</span>
    </div>
    <div class="card card-lg" style="background:var(--surface-1); border:1px solid var(--surface-3);">
      ${tasksHtml}
    </div>
  </div>

  <div style="margin-top:var(--s12);">
    <a href="#dashboard" class="btn btn-ghost"><i data-lucide="arrow-left" style="width:16px;height:16px;margin-right:8px;"></i> Exit Focus Mode</a>
  </div>
</div>`;
}

export function mount(months) {
  const fill = document.getElementById('pomo-fill');
  const timeDisplay = document.getElementById('pomo-time');
  const toggleBtn = document.getElementById('pomo-toggle');
  const icon = document.getElementById('pomo-icon');
  const resetBtn = document.getElementById('pomo-reset');
  const modeLabel = document.getElementById('pomo-mode-label');

  function updateDisplay() {
    const m = Math.floor(_timeLeft / 60);
    const s = _timeLeft % 60;
    timeDisplay.textContent = `${m}:${String(s).padStart(2, '0')}`;
    
    // Progress ring
    const pct = (_timeLeft / _totalTime) * 283; // 2 * PI * 45
    fill.style.strokeDashoffset = 283 - pct;
  }

  function tick() {
    if (!_timerRunning) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - _startTime) / 1000);
    const newTimeLeft = Math.max(0, _totalTime - elapsed);
    
    if (newTimeLeft !== _timeLeft) {
      _timeLeft = newTimeLeft;
      updateDisplay();
      if (_timeLeft === 0) {
        finishSession();
      }
    }
    
    _timerId = requestAnimationFrame(tick);
  }

  function toggleTimer() {
    if (_timerRunning) {
      _timerRunning = false;
      _totalTime = _timeLeft; // Save remaining time for next start
      cancelAnimationFrame(_timerId);
      icon.setAttribute('data-lucide', 'play');
    } else {
      _timerRunning = true;
      _startTime = Date.now();
      _totalTime = _timeLeft;
      _timerId = requestAnimationFrame(tick);
      icon.setAttribute('data-lucide', 'pause');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function resetTimer() {
    _timerRunning = false;
    cancelAnimationFrame(_timerId);
    _timeLeft = MODES[_mode].time;
    _totalTime = _timeLeft;
    icon.setAttribute('data-lucide', 'play');
    updateDisplay();
    if (window.lucide) window.lucide.createIcons();
  }

  function finishSession() {
    _timerRunning = false;
    cancelAnimationFrame(_timerId);
    icon.setAttribute('data-lucide', 'play');
    
    // Play sound (subtle beep)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}

    showToast(_mode === 'work' ? 'Focus Session Complete!' : 'Break Over!', 'success');
    if (window.lucide) window.lucide.createIcons();
  }

  function setMode(mode) {
    _mode = mode;
    _timeLeft = MODES[mode].time;
    _totalTime = _timeLeft;
    _timerRunning = false;
    cancelAnimationFrame(_timerId);
    
    // UI Updates
    modeLabel.textContent = MODES[mode].label;
    fill.style.stroke = MODES[mode].color;
    icon.setAttribute('data-lucide', 'play');
    
    document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    updateDisplay();
    if (window.lucide) window.lucide.createIcons();
  }

  // Event Listeners
  toggleBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  // Task interactions
  document.querySelectorAll('.focus-task').forEach(row => {
    row.addEventListener('click', async (e) => {
      const id  = row.dataset.id;
      const xpv = parseInt(row.dataset.xp) || 10;
      toggleTask(id, xpv);
      showXPFloat(row, xpv);
      checkBadges(months);

      // Visual update
      const s = getState();
      const done = !!s.checked[id];
      const chk = document.getElementById('fchk-' + id);
      const nm  = document.getElementById('fnm-' + id);
      if (chk) { chk.className = 'task-check' + (done?' done':''); chk.innerHTML = done?'<i data-lucide="check" style="width:14px;height:14px;"></i>':''; }
      if (nm)  { nm.className  = 'task-name'   + (done?' done':''); }
      row.style.opacity = done ? '0.5' : '1';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Initial display
  setMode('work');
}
