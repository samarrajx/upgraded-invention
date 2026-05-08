// js/views/heatmap.js — GitHub-style contribution heatmap

import { getDailyLog } from '../store.js';

export function render() {
  return `
<div class="view-heatmap">
  <div class="page-header">
    <div class="page-title"><i data-lucide="calendar" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Consistency Heatmap</div>
    <div class="page-subtitle">Every day counts towards your 3-year goal.</div>
  </div>

  <div class="card" style="overflow-x:auto;">
    <div id="heatmap-container" style="min-width:750px;padding:var(--s4);"></div>
    <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;font-size:10px;color:var(--tx-3);margin-top:var(--s2);">
      Less
      <div style="width:10px;height:10px;border-radius:2px;background:var(--surface-3);"></div>
      <div style="width:10px;height:10px;border-radius:2px;background:var(--primary-dim);"></div>
      <div style="width:10px;height:10px;border-radius:2px;background:var(--primary);"></div>
      <div style="width:10px;height:10px;border-radius:2px;background:var(--accent);"></div>
      More
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

  let html = '<div style="display:flex;gap:3px;">';

  // Day labels
  html += '<div style="display:flex;flex-direction:column;gap:3px;margin-right:4px;margin-top:14px;font-size:9px;color:var(--tx-3);">';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach((l, i) => {
    html += `<div style="height:12px;display:flex;align-items:center;">${i%2===1?l:''}</div>`;
  });
  html += '</div>';

  weeks.forEach(week => {
    html += '<div style="display:flex;flex-direction:column;gap:3px;">';
    // Add month label if first day of month
    const d1 = new Date(week[0].date);
    if (d1.getDate() <= 7) {
      html += `<div style="font-size:9px;color:var(--tx-3);height:14px;">${d1.toLocaleString('default',{month:'short'})}</div>`;
    } else {
      html += `<div style="height:14px;"></div>`;
    }

    week.forEach(d => {
      let color = 'var(--surface-3)';
      if (d.count > 0) color = 'var(--primary-dim)';
      if (d.count > 2) color = 'var(--primary)';
      if (d.count > 5) color = 'var(--accent)';

      html += `<div title="${d.count} tasks on ${d.date}" style="width:12px;height:12px;border-radius:2px;background:${color};transition:transform 0.1s;cursor:pointer;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>`;
    });
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}
