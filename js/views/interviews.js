// js/views/interviews.js — Mock interview log

import { getState, addInterview, deleteInterview } from '../store.js';

function renderStars(n) {
  return `<span style="color:var(--amber); letter-spacing:2px;">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`;
}

export function render() {
  const s = getState();
  const list = s.interviews || [];

  return `
<div class="view-interviews">
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:center; margin-bottom:var(--s8);">
    <div>
      <div class="page-title"><i data-lucide="mic" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Mock Interviews</div>
      <div class="page-subtitle">Log your practice sessions and track your confidence growth.</div>
    </div>
    <button class="btn btn-primary" onclick="window._addIvw()">+ Log Session</button>
  </div>

  <div class="grid-2" id="ivw-list">
    ${list.length ? list.slice().reverse().map(item => `
      <div class="card card-sm hover-lift">
        <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:var(--s3);">
          <div style="font-weight:700; font-size:16px; color:var(--tx);">${item.topic}</div>
          <div class="badge badge-primary" style="font-size:10px;">${item.type}</div>
        </div>
        <div style="font-size:13px; line-height:1.5; color:var(--tx-2); margin-bottom:var(--s4); white-space: pre-wrap;">${item.note || 'No notes added.'}</div>
        
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top: 1px solid var(--surface-3); padding-top:var(--s3);">
          <div>
            <div style="font-size:10px; color:var(--tx-3); text-transform:uppercase; margin-bottom:2px;">Confidence</div>
            ${renderStars(item.confidence)}
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; color:var(--tx-3);">${item.date}</div>
            <button class="btn btn-ghost btn-sm" style="color:var(--rose); margin-top:2px;" onclick="window._delIvw(${item.id})">Delete</button>
          </div>
        </div>
      </div>
    `).join('') : `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon"><i data-lucide="mic"></i></div>
        <div class="empty-state-title">No mock interviews yet</div>
        <div class="empty-state-desc">Record your first session to start tracking progress.</div>
        <button class="btn btn-primary btn-sm" style="margin-top:var(--s4);" onclick="window._addIvw()">+ Log session</button>
      </div>
    `}
  </div>
</div>`;
}

export function mount() {
  window._addIvw = () => {
    window._openModal(`
      <div class="modal">
        <div class="modal-title">Log Mock Interview</div>
        <form id="ivw-form">
          <div class="form-group">
            <label class="form-label">Topic</label>
            <input type="text" name="topic" class="form-input" placeholder="e.g. System Design: Scalability" required>
          </div>
          <div class="form-group">
            <label class="form-label">Interview Type</label>
            <select name="type" class="form-select">
              <option value="DSA">DSA / Problem Solving</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral / HR</option>
              <option value="Core CS">Core CS (OS/DBMS/NW)</option>
              <option value="Frontend">Frontend / Framework</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Confidence (1-5)</label>
            <div style="display:flex; gap:var(--s3); align-items:center;">
              <input type="range" name="confidence" min="1" max="5" step="1" value="3" class="form-input" style="flex:1;">
              <span id="conf-val" style="font-weight:700; width:20px;">3</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Key Takeaways & Improvements</label>
            <textarea name="note" class="form-textarea" placeholder="What went well? What needs work?" rows="4"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" onclick="window._closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Session</button>
          </div>
        </form>
      </div>
    `);

    const form = document.getElementById('ivw-form');
    const range = form.querySelector('input[name="confidence"]');
    range.oninput = (e) => { document.getElementById('conf-val').textContent = e.target.value; };

    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      addInterview({
        topic: fd.get('topic'),
        type: fd.get('type'),
        confidence: parseInt(fd.get('confidence')),
        note: fd.get('note'),
        date: new Date().toISOString().split('T')[0]
      });
      window._closeModal();
      const { navigate } = window._router || {};
      if (navigate) navigate('interviews');
    };
  };

  window._delIvw = (id) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      deleteInterview(id);
      const { navigate } = window._router || {};
      if (navigate) navigate('interviews');
    }
  };
}
