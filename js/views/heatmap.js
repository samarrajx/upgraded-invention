// js/views/heatmap.js — GitHub-style contribution heatmap

import { getDailyLog } from '../store.js';

export function render() {
  return `
<div class="view-heatmap">
  <div class="page-header" style="margin-bottom:var(--s8);">
    <div class="page-title"><i data-lucide="calendar-days" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Consistency Heatmap</div>
    <div class="page-subtitle">Visualizing your daily effort across the 3-year mastery path.</div>
  </div>

  <div class="card" style="padding:var(--s6); background:var(--surface-1);">
    <div style="overflow-x:auto; padding-bottom:var(--s4);">
      <div id="heatmap-container" style="min-width:800px;"></div>
    </div>
    
    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:var(--s4); border-top:1px solid var(--surface-3); padding-top:var(--s4);">
      <div style="font-size:11px; color:var(--tx-3); font-weight:500;">
        Showing last 365 days of activity
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--tx-3); font-weight:600;">
        <span>Less Intensity</span>
        <div style="display:flex; gap:3px;">
          <div style="width:12px;height:12px;border-radius:3px;background:var(--surface-3);"></div>
          <div style="width:12px;height:12px;border-radius:3px;background:var(--primary-dim); opacity:0.6;"></div>
          <div style="width:12px;height:12px;border-radius:3px;background:var(--primary); opacity:0.8;"></div>
          <div style="width:12px;height:12px;border-radius:3px;background:var(--accent);"></div>
        </div>
        <span>More Intensity</span>
      </div>
    </div>
  </div>
</div>`;
}

export function mount() {
  const container = document.getElementById('heatmap-container');
  if (!container) return;

  const log = getDailyLog();
  const today = new Date();
  today.setHours(0,0,0,0);

  // Show 52 weeks (364 days) ending today
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  // Ensure start date is a Sunday
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const days = [];
  let curr = new Date(startDate);
  while (curr <= today) {
    const key = curr.toISOString().split('T')[0];
    const count = log[key] ? log[key].length : 0;
    days.push({ date: key, count, day: curr.getDay() });
    curr.setDate(curr.getDate() + 1);
  }

  // Group by week
  const weeks = [];
  let w = [];
  days.forEach(d => {
    w.push(d);
    if (w.length === 7) { weeks.push(w); w = []; }
  });
  if (w.length) weeks.push(w);

  let html = '<div style="display:flex;gap:4px;">';

  // Day labels
  html += '<div style="display:flex;flex-direction:column;gap:4px;margin-right:8px;margin-top:16px;font-size:10px;color:var(--tx-3);font-weight:600;">';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach((l, i) => {
    html += `<div style="height:12px;display:flex;align-items:center;justify-content:flex-end;">${i%2===1?l:''}</div>`;
  });
  html += '</div>';

  weeks.forEach(week => {
    html += '<div style="display:flex;flex-direction:column;gap:4px;">';
    
    // Month label logic
    const d1 = new Date(week[0].date);
    if (d1.getDate() <= 7) {
      html += `<div style="font-size:10px;color:var(--tx-3);height:16px;font-weight:700;">${d1.toLocaleString('default',{month:'short'})}</div>`;
    } else {
      html += `<div style="height:16px;"></div>`;
    }

    week.forEach(d => {
      let color = 'var(--surface-3)';
      let opacity = '1';
      
      if (d.count > 0) { color = 'var(--primary-dim)'; opacity = '0.6'; }
      if (d.count > 2) { color = 'var(--primary)'; opacity = '0.8'; }
      if (d.count > 5) { color = 'var(--accent)'; opacity = '1'; }

      html += `<div 
        title="${d.count} tasks completed on ${new Date(d.date).toLocaleDateString()}" 
        style="width:12px;height:12px;border-radius:3px;background:${color};opacity:${opacity};transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);cursor:pointer; border: 1px solid rgba(0,0,0,0.05);" 
        onmouseover="this.style.transform='scale(1.3)'; this.style.zIndex='10'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'" 
        onmouseout="this.style.transform='scale(1)'; this.style.zIndex='1'; this.style.boxShadow='none'">
      </div>`;
    });
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}
