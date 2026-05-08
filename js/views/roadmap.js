// js/views/roadmap.js — Full roadmap tracker

import { getState, toggleTask, setNote, getNote } from '../store.js';
import { SKILL_COLORS, YEAR_GROUPS, SKILL_LABELS } from '../data.js';
import { checkBadges, showXPFloat } from '../gamification.js';

let _months = null;
let _filter = 'all';
let _searchQuery = '';

function tid(mid, wi, ti) { return `${mid}_w${wi}_t${ti}`; }

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function renderTask(mid, wi, ti, task) {
  const s = getState();
  const id = tid(mid, wi, ti);
  const done = !!s.checked[id];
  const note = getNote(id);

  // If searching and query doesn't match task title or sub, return empty string if no other match in month
  // But actually the search filters at month list level. 
  // Let's just highlight here.

  return `
  <div class="task-row-container" id="row-cnt-${id}">
    <div class="task-row ${done?'done':''}" data-id="${id}" data-xp="${task.xp||10}">
      <div class="task-check ${done?'done':''}" id="chk-${id}">${done?'✓':''}</div>
      <div class="task-info">
        <div class="task-name ${done?'done':''}" id="nm-${id}">${highlight(task.t, _searchQuery)}</div>
        ${task.s ? `<div class="task-sub">${highlight(task.s, _searchQuery)}</div>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:2px; flex-shrink:0;">
        <button class="btn btn-ghost btn-sm note-toggle-btn" onclick="window._toggleNote('${id}', event)" title="Add Notes">
          <i data-lucide="sticky-note" style="width:12px; height:12px; opacity:${note ? 1 : 0.4};"></i>
        </button>
        <div class="task-xp">+${task.xp||10}</div>
      </div>
    </div>
    <div class="task-note-area ${note ? 'visible' : ''}" id="note-area-${id}">
      <textarea class="task-note-input" placeholder="Add a note for this task..." onblur="window._saveNote('${id}', this.value)">${note}</textarea>
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
  
  // Search filter
  const matchesSearch = _searchQuery === '' || 
    m.title.toLowerCase().includes(_searchQuery.toLowerCase()) ||
    m.weeks.some(w => w.tasks.some(t => t.t.toLowerCase().includes(_searchQuery.toLowerCase()) || (t.s && t.s.toLowerCase().includes(_searchQuery.toLowerCase()))));

  if (!visWeeks.length || !matchesSearch) return '';

  const { total, done, pct } = calcPct(m, filter);
  const open = (_searchQuery !== '' || (idx === 0 && filter === 'all' && m.id === 'm1'));
  
  const skillBadges = (m.skills || [])
    .filter(sk => filter === 'all' || sk === filter)
    .map(sk => `<span class="skill-badge skill-${sk}">${SKILL_LABELS[sk]||sk}</span>`)
    .join('');

  const weeksHtml = visWeeks.map(w => {
    const wi = m.weeks.indexOf(w);
    const sc2 = SKILL_COLORS[w.skill] || {};
    return `
    <div class="roadmap-week">
      <div class="week-label" style="color:${sc2.tx||'var(--tx-2)'};">${w.label}</div>
      ${w.tasks.map((task, ti) => renderTask(m.id, wi, ti, task)).join('')}
    </div>`;
  }).join('');

  return `
  <div class="month-card" id="mc-${m.id}">
    <div class="month-hdr" onclick="window._toggleMonth('${m.id}')">
      <span class="month-badge" style="background:${m.color||'var(--primary-dim)'};color:${m.txt||'var(--primary)'};">${m.badge}</span>
      <div class="month-title-wrap">
        <div class="month-title">${highlight(m.title, _searchQuery)}</div>
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
      <div class="month-win"><strong>Goal:</strong> ${m.win}</div>
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
    const yearMonths = months.filter(m => yg.ids.includes(m.id));
    const visibleMonths = yearMonths.map((m, i) => renderMonth(m, i, filter)).filter(Boolean);
    
    if (!visibleMonths.length) return '';
    return `
      <div class="year-group">
        <div class="year-header">${yg.label}</div>
        ${visibleMonths.join('')}
      </div>
    `;
  }).join('');

  return yearHtml || `<div class="empty-state"><div class="empty-state-icon"><i data-lucide="search"></i></div><div class="empty-state-title">No matching tasks found</div><div class="empty-state-desc">Try a different keyword or skill filter.</div></div>`;
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
  <div class="page-header" style="padding-bottom:var(--s4);">
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
    
    <div class="search-container" style="margin-top:var(--s6);">
      <i data-lucide="search" class="search-icon"></i>
      <input type="text" id="roadmap-search" class="search-input" placeholder="Search tasks, skills, or months..." value="${_searchQuery}">
    </div>

    <div class="prog-wrap" style="margin-top:var(--s4);height:6px; background:var(--surface-3);">
      <div class="prog-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));"></div>
    </div>
  </div>

  <div class="filter-tabs">${filterHtml}</div>

  <div id="month-list" class="anim-stagger">
    ${renderMonthList(months, _filter)}
  </div>

  <button class="btn btn-primary" id="jump-current-btn" style="position:fixed; bottom:80px; right:20px; border-radius:50px; padding:12px 20px; box-shadow:0 8px 24px rgba(0,0,0,0.4); z-index:100; font-weight:700; display:flex; align-items:center; gap:8px;">
    <i data-lucide="navigation-2" style="width:16px; height:16px;"></i>
    Jump to Current
  </button>
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
      _refreshList();
    });
  });

  // Search
  const searchInput = document.getElementById('roadmap-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      _searchQuery = e.target.value;
      _refreshList();
    });
  }

  // Jump to Current
  const jumpBtn = document.getElementById('jump-current-btn');
  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      // Logic: Find first month with < 100% completion
      const currentMonth = months.find(m => {
        const { pct } = calcPct(m, 'all');
        return pct < 100;
      }) || months[0];

      const el = document.getElementById(`mc-${currentMonth.id}`);
      if (el) {
        // Toggle open if closed
        const body = document.getElementById('bd-' + currentMonth.id);
        if (body && !body.classList.contains('open')) window._toggleMonth(currentMonth.id);
        
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    });
  }

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

  window._toggleNote = (tid, e) => {
    e.stopPropagation();
    const area = document.getElementById(`note-area-${tid}`);
    area.classList.toggle('visible');
    if (area.classList.contains('visible')) {
      area.querySelector('textarea').focus();
    }
  };

  window._saveNote = (tid, val) => {
    setNote(tid, val);
    // Update icon opacity
    const btn = document.querySelector(`#row-cnt-${tid} .note-toggle-btn i`);
    if (btn) btn.style.opacity = val ? '1' : '0.4';
  };
}

function _refreshList() {
  const list = document.getElementById('month-list');
  if (list) {
    list.innerHTML = renderMonthList(_months, _filter);
    _bindTasks(_months);
    _updateTopStats(_months);
    if (window.lucide) window.lucide.createIcons();
  }
}

function _bindTasks(months) {
  document.querySelectorAll('.task-row[data-id]').forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't toggle if clicking note button or inside note area
      if (e.target.closest('.note-toggle-btn') || e.target.closest('.task-note-area')) return;
      
      const id  = row.dataset.id;
      const xpv = parseInt(row.dataset.xp) || 10;
      toggleTask(id, xpv);
      showXPFloat(row, xpv);
      _updateTaskUI(id, months);
    });
  });
}

function _updateTaskUI(id, months) {
  const s = getState();
  const done = !!s.checked[id];
  const row = document.querySelector(`.task-row[data-id="${id}"]`);
  const chk = document.getElementById('chk-' + id);
  const nm  = document.getElementById('nm-'  + id);
  
  if (row) row.classList.toggle('done', done);
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
