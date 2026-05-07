// js/views/focus.js — Deep work mode

import { getState, toggleTask } from '../store.js';
import { getTodayTasks, showXPFloat, checkBadges } from '../gamification.js';

export function render(months) {
  const tasks = getTodayTasks(months, 5);

  const tasksHtml = tasks.length
    ? tasks.map(t => {
        const s = getState();
        const done = !!s.checked[t.id];
        return `
        <div class="task-row focus-task" data-id="${t.id}" data-xp="${t.task.xp||10}" style="${done?'opacity:0.5':''}">
          <div class="task-check ${done?'done':''}" id="fchk-${t.id}">${done?'✓':''}</div>
          <div class="task-info">
            <div class="task-name ${done?'done':''}" id="fnm-${t.id}" style="font-size:16px;">${t.task.t}</div>
            <div class="task-sub">${t.monthTitle} · ${t.skill}</div>
          </div>
          <div class="task-xp" style="font-size:14px;">+${t.task.xp||10} XP</div>
        </div>`;
      }).join('')
    : `<div class="empty-state"><div class="empty-state-icon">🧘‍♂️</div><div class="empty-state-title">No tasks pending</div><div class="empty-state-desc">You are all caught up for today. Take a break!</div></div>`;

  return `
<div class="view-focus" style="max-width:700px;margin:0 auto;text-align:center;padding-top:var(--s8);">
  <div style="font-size:48px;margin-bottom:var(--s4);">🎯</div>
  <div class="page-title" style="font-size:32px;margin-bottom:var(--s2);">Focus Mode</div>
  <div class="page-subtitle" style="margin-bottom:var(--s8);">Clear the noise. Just do these.</div>

  <div class="card card-lg" style="text-align:left;">
    ${tasksHtml}
  </div>

  <div style="margin-top:var(--s8);">
    <a href="#dashboard" class="btn btn-ghost">← Exit Focus Mode</a>
  </div>
</div>`;
}

export function mount(months) {
  document.querySelectorAll('.focus-task').forEach(row => {
    row.addEventListener('click', async () => {
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
      if (chk) { chk.className = 'task-check' + (done?' done':''); chk.textContent = done?'✓':''; }
      if (nm)  { nm.className  = 'task-name'   + (done?' done':''); }
      row.style.opacity = done ? '0.5' : '1';
    });
  });
}
