// js/views/interviews.js — Mock interview log

import { getState, addInterview, deleteInterview } from '../store.js';

export function render() {
  const s = getState();
  const list = s.interviews || [];

  return `
<div class="view-interviews">
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-end;">
    <div>
      <div class="page-title"><i data-lucide="mic" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Mock Interviews</div>
      <div class="page-subtitle">Log your practice sessions and confidence.</div>
    </div>
    <button class="btn btn-primary" onclick="window._addIvw()">+ Log Session</button>
  </div>

  <div class="grid-2" id="ivw-list">
    ${list.length ? list.reverse().map(item => `
      <div class="card card-sm hover-lift">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:700;color:var(--tx);">${item.topic}</div>
          <div class="badge badge-primary">${item.type}</div>
        </div>
        <div style="margin-top:var(--s2);font-size:13px;color:var(--tx-2);">${item.note||'No notes.'}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--s4);font-size:11px;color:var(--tx-3);">
          <div>Confidence: ${'★'.repeat(item.confidence)}${'☆'.repeat(5-item.confidence)}</div>
          <div>${item.date} <button class="btn btn-ghost" style="padding:2px 6px;margin-left:8px;" onclick="window._delIvw(${item.id})">×</button></div>
        </div>
      </div>
    `).join('') : `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon"><i data-lucide="message-square"></i></div><div class="empty-state-title">No interviews logged</div></div>`}
  </div>
</div>`;
}

export function mount() {
  window._addIvw = () => {
    const topic = prompt('Topic (e.g. Arrays, System Design, Behavioral):'); if (!topic) return;
    const type = prompt('Type (DSA / Design / HR):', 'DSA'); if (!type) return;
    const conf = parseInt(prompt('Confidence (1 to 5):', '3')) || 3;
    const note = prompt('One takeaway note:');
    addInterview({ topic, type, confidence: Math.min(5, Math.max(1, conf)), note });
    if(window._router) window._router.navigate('interviews');
  };
  window._delIvw = (id) => {
    if(confirm('Delete log?')) deleteInterview(id);
    if(window._router) window._router.navigate('interviews');
  };
}
