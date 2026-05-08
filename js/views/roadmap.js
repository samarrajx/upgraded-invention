// js/views/roadmap.js — Full roadmap tracker

import { getState, toggleTask } from '../store.js';
import { SKILL_COLORS, YEAR_GROUPS, SKILL_LABELS } from '../data.js';
import { checkBadges, showXPFloat, showToast } from '../gamification.js';

let _months = null;
let _filter = 'all';



function tid(mid, wi, ti) { return `${mid}_w${wi}_t${ti}`; }

function renderTask(mid, wi, ti, task) {
  const s = getState();
  const id = tid(mid, wi, ti);
  const done = !!s.checked[id];
  return `
  <div class="task-row" data-id="${id}" data-xp="${task.xp||10}">
    <div class="task-check ${done?'done':''}" id="chk-${id}">${done?'✓':''}</div>
    <div class="task-info">
      <div class="task-name ${done?'done':''}" id="nm-${id}">${task.t}</div>
      ${task.s ? `<div class="task-sub">${task.s}</div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0;">
      ${task.time ? `<div class="task-time">${task.time}</div>` : ''}
      <div class="task-xp">+${task.xp||10}</div>
    </div>
  </div>`;
}

function calcPct(m, filter) {
  const s = getState();
  let total = 0, done = 0;
  m.weeks.forEach((w, wi) => {
    if (filter !== 'all' && w.skill !== filter) return;
    w.tasks.forEach((_, ti) => {
      total++;
      if (s.checked[tid(m.id, wi, ti)]) done++;
    });
  });
  return { total, done, pct: total ? Math.round(done/total*100) : 0 };
}

function renderMonth(m, idx, filter) {
  const visWeeks = m.weeks.filter(w => filter === 'all' || w.skill === filter);
  if (!visWeeks.length) return '';

  const { total, done, pct } = calcPct(m, filter);
  const open = idx === 0 && filter === 'all' && m.id === 'm1';
  
  const skillBadges = (m.skills || [])
    .filter(sk => filter === 'all' || sk === filter)
    .map(sk => `<span class="skill-badge skill-${sk}">${SKILL_LABELS[sk]||sk}</span>`)
    .join('');

  const weeksHtml = visWeeks.map(w => {
    const wi = m.weeks.indexOf(w);
    const sc2 = SKILL_COLORS[w.skill] || {};
    return `
    <div>
      <div class="week-label" style="color:${sc2.tx||'var(--tx-2)'};">${w.label}</div>
      ${w.tasks.map((task, ti) => renderTask(m.id, wi, ti, task)).join('')}
    </div>`;
  }).join('');

  return `
  <div class="month-card" id="mc-${m.id}">
    <div class="month-hdr" onclick="window._toggleMonth('${m.id}')">
      <span class="month-badge" style="background:${m.color||'var(--primary-dim)'};color:${m.txt||'var(--primary)'};">${m.badge}</span>
      <div class="month-title-wrap">
        <div class="month-title">${m.title}</div>
        <div class="month-badges">${skillBadges}</div>
        <div class="month-prog-wrap">
          <div class="month-prog-fill" id="pf-${m.id}" style="width:${pct}%;background:${m.prog||'var(--primary)'};"></div>
        </div>
      </div>
      <span class="month-prog-txt" id="pp-${m.id}">${done}/${total}</span>
      <span class="month-chev" id="chev-${m.id}" style="transform:${open?'rotate(180deg)':'none'};"><i data-lucide="chevron-down"></i></span>
    </div>
    <div class="month-body ${open?'open':''}" id="bd-${m.id}">
      ${weeksHtml}
      <div class="month-win"><strong>Month win:</strong> ${m.win}</div>
      ${m.rule ? `<div class="month-rule">${m.rule}</div>` : ''}
    </div>
  </div>`;
}

function renderStats(months, filter) {
  const s = getState();
  let total = 0, done = 0;
  months.forEach(m => m.weeks.forEach((w, wi) => {
    if (filter !== 'all' && w.skill !== filter) return;
    w.tasks.forEach((_, ti) => {
      total++;
      if (s.checked[tid(m.id, wi, ti)]) done++;
    });
  }));
  const pct = total ? Math.round(done/total*100) : 0;
  return { total, done, pct };
}

function renderMonthList(months, filter) {
  const yearHtml = YEAR_GROUPS.map(yg => {
    const yearMonths = months.filter(m => yg.ids.includes(m.id) && (filter === 'all' || m.weeks.some(w => w.skill === filter)));
    if (!yearMonths.length) return '';
    return `
      <div class="year-group">
        <div class="year-header">${yg.label}</div>
        ${yearMonths.map((m, i) => renderMonth(m, i, filter)).join('')}
      </div>
    `;
  }).join('');

  return yearHtml || `<div class="empty-state"><div class="empty-state-icon"><i data-lucide="search"></i></div><div class="empty-state-title">No months match this filter</div></div>`;
}

export function render(months) {
  _months = months;
  const { total, done, pct } = renderStats(months, _filter);

  const filters = ['all','python','dsa','english','math','projects','interview','system'];
  const filterHtml = filters.map(f =>
    `<button class="filter-tab ${_filter===f?'active':''}" data-f="${f}">${f==='all'?'All':SKILL_LABELS[f]||f}</button>`
  ).join('');

  return `
<div class="view-roadmap">
  <div class="page-header">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:var(--s3);">
      <div>
        <div class="page-title"><i data-lucide="map" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Career OS Roadmap</div>
        <div class="page-subtitle">3-Year AI Engineer Mastery Path</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:800;color:var(--primary);">${pct}%</div>
        <div style="font-size:12px;color:var(--tx-3);">${done} / ${total} tasks</div>
      </div>
    </div>
    <div class="prog-wrap" style="margin-top:var(--s4);height:8px;">
      <div class="prog-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));"></div>
    </div>
  </div>

  <div class="filter-tabs">${filterHtml}</div>

  <div id="month-list" class="anim-stagger">
    ${renderMonthList(months, _filter)}
  </div>
</div>`;
}

export function mount(months) {
  _months = months;

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _filter = btn.dataset.f;
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const list = document.getElementById('month-list');
      list.innerHTML = renderMonthList(months, _filter);
      _bindTasks(months);
      _updateTopStats(months);
      if (window.lucide) window.lucide.createIcons();
    });
  });

  _bindTasks(months);

  // Global toggle (accordion)
  window._toggleMonth = (mid) => {
    const body = document.getElementById('bd-' + mid);
    const chev = document.getElementById('chev-' + mid);
    if (!body) return;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (chev) chev.style.transform = isOpen ? 'none' : 'rotate(180deg)';
  };
}

function _bindTasks(months) {
  document.querySelectorAll('.task-row[data-id]').forEach(row => {
    row.addEventListener('click', () => {
      const id  = row.dataset.id;
      const xpv = parseInt(row.dataset.xp) || 10;
      toggleTask(id, xpv);
      showXPFloat(row, xpv);
      checkBadges(months);
      _updateTaskUI(id, months);
    });
  });
}

function _updateTaskUI(id, months) {
  const s = getState();
  const done = !!s.checked[id];
  const chk = document.getElementById('chk-' + id);
  const nm  = document.getElementById('nm-'  + id);
  if (chk) { chk.className = 'task-check' + (done?' done':''); chk.textContent = done?'✓':''; }
  if (nm)  { nm.className  = 'task-name'   + (done?' done':''); }

  // Update month progress
  const mid = id.split('_')[0];
  const m = months.find(x => x.id === mid);
  if (m) {
    const { total, done: d, pct } = calcPct(m, _filter);
    const pf = document.getElementById('pf-' + mid);
    const pp = document.getElementById('pp-' + mid);
    if (pf) pf.style.width = pct + '%';
    if (pp) pp.textContent = d + '/' + total;
  }

  _updateTopStats(months);
}

function _updateTopStats(months) {
  const { total, done, pct } = renderStats(months, _filter);
  const bar = document.querySelector('.view-roadmap .prog-fill');
  if (bar) bar.style.width = pct + '%';
  const els = document.querySelectorAll('.view-roadmap .page-header [style*="font-size:28px"]');
  els.forEach(el => el.textContent = pct + '%');
  const taskCountEl = document.querySelector('.view-roadmap .page-header [style*="font-size:12px"]');
  if (taskCountEl) taskCountEl.textContent = `${done} / ${total} tasks`;
}
