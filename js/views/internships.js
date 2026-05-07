// js/views/internships.js — Internship & application tracker

import { getState, addInternship, updateInternship, deleteInternship } from '../store.js';

function renderCard(item) {
  const statusColors = {
    'Applied': 'var(--sky)',
    'OA': 'var(--amber)',
    'Interview': 'var(--primary)',
    'Offer': 'var(--accent)',
    'Rejected': 'var(--rose)'
  };
  const color = statusColors[item.status] || 'var(--tx-2)';

  return `
  <div class="card card-sm hover-lift" style="border-left:3px solid ${color};">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-weight:700;font-size:15px;color:var(--tx);">${item.company}</div>
        <div style="font-size:13px;color:var(--tx-2);margin-top:2px;">${item.role}</div>
      </div>
      <div style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:var(--surface-2);color:${color};">
        ${item.status}
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:var(--s4);">
      <div style="font-size:11px;color:var(--tx-3);">Applied: ${item.appliedDate}</div>
      <div>
        <button class="btn btn-ghost btn-sm" onclick="window._editInt(${item.id})">Edit</button>
      </div>
    </div>
  </div>`;
}

export function render() {
  const s = getState();
  const list = s.internships || [];

  return `
<div class="view-internships">
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-end;">
    <div>
      <div class="page-title">💼 Internships</div>
      <div class="page-subtitle">Track your applications and follow-ups.</div>
    </div>
    <button class="btn btn-primary" onclick="window._addInt()">+ New Application</button>
  </div>

  <div class="grid-3" id="intern-list">
    ${list.length ? list.reverse().map(renderCard).join('') : `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-title">No applications yet</div>
        <div class="empty-state-desc">Start applying and track them here.</div>
      </div>`}
  </div>
</div>`;
}

export function mount() {
  window._addInt = () => {
    const c = prompt('Company Name:'); if (!c) return;
    const r = prompt('Role (e.g. AI Intern):', 'AI Intern'); if (!r) return;
    const d = new Date().toISOString().split('T')[0];
    addInternship({ company: c, role: r, status: 'Applied', appliedDate: d });
    const { navigate } = window._router || {};
    if(navigate) navigate('internships');
  };

  window._editInt = (id) => {
    const s = getState();
    const item = s.internships.find(x => x.id === id);
    if (!item) return;

    const action = prompt(`Edit: ${item.company}\n\n1. Update Status\n2. Delete\n\nEnter 1 or 2:`, "1");
    if (action === "1") {
      const status = prompt("Enter new status (Applied, OA, Interview, Offer, Rejected):", item.status);
      if (status) updateInternship(id, { status });
    } else if (action === "2") {
      if (confirm(`Delete ${item.company} application?`)) deleteInternship(id);
    }
    const { navigate } = window._router || {};
    if(navigate) navigate('internships');
  };
}
