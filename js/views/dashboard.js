// js/views/dashboard.js — Command Center

import { getState, getLevelInfo, getProgressStats, getSkillStats, getTodayCount, getDailyGoal, setLeetcodeCount } from '../store.js';
import { SKILL_LABELS } from '../data.js';
import { getTodayTasks, getSmartSuggestion, BADGES, showToast, showXPFloat, checkBadges } from '../gamification.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function daysUntilBCA() {
  const target = new Date('2028-06-01');
  const diff = Math.ceil((target - new Date()) / 86400000);
  return diff > 0 ? diff : 0;
}

function skillBar(skill, done, total) {
  const pct = total ? Math.round(done / total * 100) : 0;
  const colors = {
    python:'var(--s-py-pr)', dsa:'var(--s-ds-pr)', english:'var(--s-en-pr)',
    math:'var(--s-ma-pr)', projects:'var(--s-pr-pr)', interview:'var(--s-in-pr)',
    system:'var(--s-sy-pr)',
  };
  return `
    <div class="skill-row">
      <div class="skill-row-top">
        <span class="skill-badge skill-${skill}">${SKILL_LABELS[skill]||skill}</span>
        <span class="skill-pct">${pct}%</span>
      </div>
      <div class="prog-wrap prog-sm" style="margin-top:6px; background:var(--surface-3);">
        <div class="prog-fill" style="width:${pct}%;background:${colors[skill]||'var(--primary)'};"></div>
      </div>
    </div>`;
}

function renderTodayTask({ id, task, skill, monthTitle }) {
  const s = getState();
  const done = !!s.checked[id];
  return `
    <div class="task-row today-task" data-id="${id}" data-xp="${task.xp||10}" style="${done?'opacity:.5':''}">
      <div class="task-check ${done?'done':''}">${done?'<i data-lucide="check" style="width:12px;height:12px;"></i>':''}</div>
      <div class="task-info">
        <div class="task-name ${done?'done':''}">${task.t}</div>
        <div class="task-sub">${monthTitle} · <span class="skill-badge skill-${skill}" style="font-size:9px;padding:1px 6px;">${skill}</span></div>
      </div>
      <div class="task-xp">+${task.xp||10} XP</div>
    </div>`;
}

export function render(months) {
  const s = getState();
  const lv = getLevelInfo();
  const prog = getProgressStats(months);
  const skills = getSkillStats(months);
  const todayTasks = getTodayTasks(months, 3);
  const suggestion = getSmartSuggestion(months);
  const recentBadges = s.badges.slice(-4).reverse();
  const todayCount = getTodayCount();
  const dailyGoal = getDailyGoal();
  const goalPct = Math.min(100, Math.round((todayCount / dailyGoal) * 100));

  const sgIcon = { weak_skill:'target', streak:'flame', general:'lightbulb' }[suggestion.type] || 'lightbulb';

  return `
<div class="view-dashboard">

  <div class="dash-header">
    <div>
      <div class="dash-greeting">${greeting()}, Samar <i data-lucide="sparkles" style="width:20px;height:20px;margin-left:4px;color:var(--amber);"></i></div>
      <div class="dash-date">${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div class="dash-streak ${s.streak>0?'active':''}">
      <i data-lucide="flame" class="flame-icon"></i>
      <span class="streak-num">${s.streak}</span>
      <span class="streak-label">day streak</span>
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:var(--s5); gap:var(--s5);">
    <!-- XP Hero Card -->
    <div class="card xp-hero" style="margin-bottom:0;">
      <div class="xp-hero-top">
        <div>
          <div class="xp-title">Level ${lv.level} — <span style="color:var(--primary)">${lv.title}</span></div>
          <div class="xp-sub">${s.xp.toLocaleString()} XP total${lv.nextXP ? ` · ${lv.nextXP - s.xp} to next level` : ' · MAX LEVEL'}</div>
        </div>
        <div class="xp-badge-big">L${lv.level}</div>
      </div>
      <div class="prog-wrap" style="margin-top:var(--s5);height:8px; background:var(--surface-3);">
        <div class="prog-fill" style="width:${lv.pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:999px;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;">
        <span style="font-size:10px;color:var(--tx-3)">PROGRESS TO L${lv.level+1}</span>
        <span style="font-size:10px;color:var(--tx-3);font-weight:700;">${lv.pct}%</span>
      </div>
    </div>

    <!-- Daily Goal Card -->
    <div class="card" style="margin-bottom:0; display:flex; flex-direction:column; justify-content:center;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--s3);">
        <div style="font-weight:700; font-size:14px; color:var(--tx-2); text-transform:uppercase; letter-spacing:1px;">Daily Goal</div>
        <div style="font-size:12px; color:var(--primary); font-weight:700;">${todayCount} / ${dailyGoal} TASKS</div>
      </div>
      <div style="display:flex; align-items:center; gap:var(--s5);">
         <div style="position:relative; width:60px; height:60px;">
            <svg viewBox="0 0 36 36" style="width:60px; height:60px; transform:rotate(-90deg);">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--surface-3)" stroke-width="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="${goalPct}, 100" stroke-linecap="round" />
            </svg>
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:12px; font-weight:800; color:var(--tx);">${goalPct}%</div>
         </div>
         <div style="flex:1;">
            <div style="font-size:13px; color:var(--tx-2); line-height:1.4;">
              ${goalPct >= 100 ? "Goal smashed! You're ahead of the curve today." : `Complete ${dailyGoal - todayCount} more tasks to hit your daily target.`}
            </div>
         </div>
      </div>
    </div>
  </div>

  <div class="grid-4 anim-stagger" style="margin-bottom:var(--s8);">
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--primary-dim);"><i data-lucide="map"></i></div>
      <div class="stat-card-value">${prog.pct}%</div>
      <div class="stat-card-label">Roadmap</div>
      <div class="stat-card-sub">${prog.done}/${prog.total} tasks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--amber-dim);"><i data-lucide="flame"></i></div>
      <div class="stat-card-value">${s.streak}</div>
      <div class="stat-card-label">Streak</div>
      <div class="stat-card-sub">Best: ${s.longestStreak}</div>
    </div>
    <div class="stat-card" id="dash-leet-card" style="cursor:pointer;">
      <div class="stat-card-icon" style="background:var(--sky-dim);"><i data-lucide="code"></i></div>
      <div class="stat-card-value">${s.leetcodeCount}</div>
      <div class="stat-card-label">LeetCode</div>
      <div class="stat-card-sub" style="color:var(--primary); font-weight:700;">Update →</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--accent-dim);"><i data-lucide="calendar"></i></div>
      <div class="stat-card-value">${daysUntilBCA()}</div>
      <div class="stat-card-label">To BCA End</div>
      <div class="stat-card-sub">Placement Ready</div>
    </div>
  </div>

  <div class="card suggestion-card" style="margin-bottom:var(--s8); border-left:4px solid var(--primary); background: linear-gradient(to right, var(--primary-dim), transparent);">
    <div style="display:flex;gap:var(--s4);align-items:center;">
      <div class="suggestion-icon-wrap" style="background:var(--surface-1); width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--primary); box-shadow: var(--shadow-sm);">
        <i data-lucide="${sgIcon}"></i>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px;font-weight:800;color:var(--primary);margin-bottom:2px; text-transform:uppercase; letter-spacing:1px;">AI Coach Insight</div>
        <div style="font-size:14px;color:var(--tx); line-height:1.5; font-weight:500;">${suggestion.msg}</div>
      </div>
      ${suggestion.skill ? `<a class="btn btn-sm btn-primary" style="white-space:nowrap;" href="#roadmap">Resume Path</a>` : ''}
    </div>
  </div>

  <div class="grid-2" style="gap:var(--s8);margin-bottom:var(--s8);">
    <div>
      <div class="section-head">
        <div class="section-title"><i data-lucide="list-todo" style="width:16px;height:16px;"></i> High Priority</div>
        <a href="#focus" style="font-size:11px;color:var(--primary);">Open Focus Mode</a>
      </div>
      <div class="card card-sm today-tasks-list" style="background:var(--surface-1);">
        ${todayTasks.length
          ? todayTasks.map(renderTodayTask).join('')
          : `<div class="empty-state" style="padding:var(--s6);">
               <div class="empty-state-icon"><i data-lucide="check-circle"></i></div>
               <div class="empty-state-title">Daily Focus Cleared</div>
             </div>`
        }
      </div>
    </div>

    <div>
      <div class="section-head">
        <div class="section-title"><i data-lucide="bar-chart-3" style="width:16px;height:16px;"></i> Skill Distribution</div>
        <a href="#analytics" style="font-size:11px;color:var(--primary);">View Analytics</a>
      </div>
      <div class="card card-sm" style="background:var(--surface-1);">
        ${Object.entries(skills).map(([sk, { done, total }]) => skillBar(sk, done, total)).join('')}
      </div>
    </div>
  </div>

  <div class="section-head"><div class="section-title"><i data-lucide="zap" style="width:16px;height:16px;"></i> Operations</div></div>
  <div class="quick-actions" style="margin-bottom:var(--s10);">
    <a href="#focus"       class="btn btn-primary"><i data-lucide="target"></i> Focus Mode</a>
    <a href="#roadmap"     class="btn btn-secondary"><i data-lucide="map"></i> Roadmap</a>
    <a href="#internships" class="btn btn-secondary"><i data-lucide="briefcase"></i> Internships</a>
    <a href="#interviews"  class="btn btn-secondary"><i data-lucide="mic"></i> Interviews</a>
    <a href="#heatmap"     class="btn btn-secondary"><i data-lucide="calendar"></i> Heatmap</a>
  </div>

</div>

<style>
.dash-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s8);flex-wrap:wrap;gap:var(--s3);}
.dash-greeting{font-size:28px;font-weight:900;letter-spacing:-.04em;}
.dash-date{font-size:13px;color:var(--tx-3);margin-top:4px; font-weight:500;}
.dash-streak{display:flex;align-items:center;gap:8px;background:var(--amber-dim);border:1px solid var(--amber);border-radius:50px;padding:var(--s2) var(--s5);}
.dash-streak.active{box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);}
.streak-num{font-size:24px;font-weight:900;color:var(--amber);}
.streak-label{font-size:11px;color:var(--amber);font-weight:700; text-transform:uppercase; letter-spacing:1px;}
.xp-hero-top{display:flex;align-items:center;justify-content:space-between;}
.xp-title{font-size:18px;font-weight:800; letter-spacing:-0.02em;}
.xp-sub{font-size:12px;color:var(--tx-3);margin-top:4px;}
.xp-badge-big{font-size:24px;font-weight:900;color:var(--primary);background:var(--surface-1);width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center; box-shadow: var(--shadow-sm); border: 1px solid var(--surface-3);}
.skill-row{margin-bottom:var(--s4);}
.skill-row:last-child{margin-bottom:0;}
.skill-row-top{display:flex;align-items:center;justify-content:space-between;}
.skill-pct{font-size:11px;font-weight:800;color:var(--tx-2);}
.quick-actions{display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:var(--s3);}
.quick-actions .btn { justify-content: flex-start; padding: var(--s4) var(--s5); height: auto; }
.quick-actions .btn i { margin-right: var(--s3); width: 18px; height: 18px; }
</style>`;
}

export function mount(months) {
  // LeetCode quick update via Modal
  const leetCard = document.getElementById('dash-leet-card');
  if (leetCard) {
    leetCard.addEventListener('click', () => {
      const s = getState();
      window._openModal(`
        <div class="modal">
          <div class="modal-title">Update LeetCode Progress</div>
          <form id="leet-form">
            <div class="form-group">
              <label class="form-label">Total Solved Count</label>
              <input type="number" name="count" class="form-input" value="${s.leetcodeCount}" min="0" required>
              <div style="font-size:11px; color:var(--tx-3); margin-top:4px;">Current: ${s.leetcodeCount} solved</div>
            </div>
            <div class="form-group">
              <label class="form-label">Note / Problems Worked On</label>
              <textarea name="note" class="form-textarea" placeholder="e.g. Solved 3 Hard Dynamic Programming problems today."></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-ghost" onclick="window._closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Statistics</button>
            </div>
          </form>
        </div>
      `);

      document.getElementById('leet-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const n = parseInt(fd.get('count'));
        setLeetcodeCount(n, fd.get('note'));
        showToast(`LeetCode updated to ${n}`, 'success');
        window._closeModal();
        const { navigate } = window._router || {};
        if (navigate) navigate('dashboard');
      };
    });
  }

  // Today's task toggles
  document.querySelectorAll('.today-task').forEach(row => {
    row.addEventListener('click', async (e) => {
      const id  = row.dataset.id;
      const xpv = parseInt(row.dataset.xp) || 10;
      const { toggleTask } = await import('../store.js');
      toggleTask(id, xpv);
      showXPFloat(row, xpv);
      checkBadges(months);
      
      const { navigate } = window._router || {};
      if (navigate) navigate('dashboard');
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
