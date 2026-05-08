// js/views/internships.js — Internship & application tracker

import { getState, addInternship, updateInternship, deleteInternship } from '../store.js';

const STATUS_COLORS = {
  'Applied': 'var(--sky)',
  'OA': 'var(--amber)',
  'Phone Screen': 'var(--primary)',
  'Interview': 'var(--primary)',
  'Offer': 'var(--accent)',
  'Rejected': 'var(--rose)'
};

const STATUS_OPTIONS = ['Applied', 'OA', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

function renderCard(item, isCompact = false) {
  const color = STATUS_COLORS[item.status] || 'var(--tx-3)';
  
  if (isCompact) {
    return `
    <div class="pipeline-card" style="border-left-color: ${color}" onclick="window._editInt(${item.id})">
      <div class="pipeline-card-title">${item.company}</div>
      <div class="pipeline-card-sub">${item.role}</div>
    </div>`;
  }

  return `
  <div class="card card-sm hover-lift" style="border-left:3px solid ${color};">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div style="flex:1; cursor:pointer;" onclick="window._editInt(${item.id})">
        <div style="font-weight:700;font-size:15px;color:var(--tx);">${item.company}</div>
        <div style="font-size:13px;color:var(--tx-2);margin-top:2px;">${item.role}</div>
      </div>
      <select class="form-select" style="width:auto; height:28px; padding:0 24px 0 8px; font-size:11px; font-weight:700; background-color:var(--surface-2); color:${color}; border:none;" onchange="window._updateStatus(${item.id}, this.value)">
        ${STATUS_OPTIONS.map(opt => `<option value="${opt}" ${item.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:var(--s4);">
      <div style="font-size:11px;color:var(--tx-3);">Applied: ${item.appliedDate}</div>
      <button class="btn btn-ghost btn-sm" style="padding:4px 8px; height:auto;" onclick="window._editInt(${item.id})">
        <i data-lucide="edit-3" style="width:12px;height:12px;"></i>
      </button>
    </div>
  </div>`;
}

function renderPipeline(list) {
  return `
  <div class="pipeline-container">
    ${STATUS_OPTIONS.map(status => {
      const colItems = list.filter(item => item.status === status);
      return `
      <div class="pipeline-column">
        <div class="pipeline-col-header">
          <span>${status}</span>
          <span class="pipeline-count">${colItems.length}</span>
        </div>
        <div class="pipeline-list">
          ${colItems.map(item => renderCard(item, true)).join('')}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

export function render() {
  const s = getState();
  const list = s.internships || [];
  const viewMode = s.internshipViewMode || 'grid'; // Default to grid

  return `
<div class="view-internships">
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:center; margin-bottom:var(--s8);">
    <div>
      <div class="page-title"><i data-lucide="briefcase" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Internships</div>
      <div class="page-subtitle">Track your applications and follow-ups.</div>
    </div>
    <div style="display:flex; gap:var(--s3);">
      <div class="filter-tabs" style="margin-bottom:0;">
        <button class="filter-tab ${viewMode === 'grid' ? 'active' : ''}" onclick="window._switchView('grid')">Cards</button>
        <button class="filter-tab ${viewMode === 'pipeline' ? 'active' : ''}" onclick="window._switchView('pipeline')">Pipeline</button>
      </div>
      <button class="btn btn-primary" onclick="window._addInt()">+ New Application</button>
    </div>
  </div>

  ${list.length === 0 ? `
    <div class="empty-state">
      <div class="empty-state-icon"><i data-lucide="briefcase"></i></div>
      <div class="empty-state-title">No applications yet</div>
      <div class="empty-state-desc">Start applying this week. Even 3 targeted applications this month is a start.</div>
      <button class="btn btn-primary btn-sm" style="margin-top:var(--s4);" onclick="window._addInt()">+ Add your first application</button>
    </div>
  ` : (viewMode === 'grid' ? `<div class="grid-3">${list.slice().reverse().map(item => renderCard(item)).join('')}</div>` : renderPipeline(list))}
</div>`;
}

export function mount() {
  window._switchView = (mode) => {
    // Store temporarily in state or just re-render
    const s = getState();
    s.internshipViewMode = mode;
    const { navigate } = window._router || {};
    if (navigate) navigate('internships');
  };

  window._updateStatus = (id, status) => {
    updateInternship(id, { status });
    const { navigate } = window._router || {};
    if (navigate) navigate('internships');
  };

  window._addInt = () => {
    const today = new Date().toISOString().split('T')[0];
    window._openModal(`
      <div class="modal">
        <div class="modal-title">New Application</div>
        <form id="int-form">
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input type="text" name="company" class="form-input" placeholder="e.g. Razorpay" required>
            <span class="form-error" id="err-company" style="display:none;">Company is required</span>
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" name="role" class="form-input" placeholder="e.g. Backend Intern" required>
            <span class="form-error" id="err-role" style="display:none;">Role is required</span>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
              ${STATUS_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Applied Date</label>
            <input type="date" name="appliedDate" class="form-input" value="${today}">
          </div>
          <div class="form-group">
            <label class="form-label">Notes (Optional)</label>
            <textarea name="note" class="form-textarea" placeholder="Key details, contacts, links..."></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" onclick="window._closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Application</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('int-form').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const company = fd.get('company').trim();
      const role = fd.get('role').trim();
      
      let valid = true;
      if (!company) { document.getElementById('err-company').style.display = 'block'; valid = false; }
      if (!role) { document.getElementById('err-role').style.display = 'block'; valid = false; }
      if (!valid) return;

      addInternship({
        company,
        role,
        status: fd.get('status'),
        appliedDate: fd.get('appliedDate'),
        note: fd.get('note')
      });
      window._closeModal();
      const { navigate } = window._router || {};
      if (navigate) navigate('internships');
    };
  };

  window._editInt = (id) => {
    const s = getState();
    const item = s.internships.find(x => x.id === id);
    if (!item) return;

    window._openModal(`
      <div class="modal">
        <div class="modal-title">Edit Application</div>
        <form id="int-form-edit">
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input type="text" name="company" class="form-input" value="${item.company}" required>
            <span class="form-error" id="err-company" style="display:none;">Company is required</span>
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" name="role" class="form-input" value="${item.role}" required>
            <span class="form-error" id="err-role" style="display:none;">Role is required</span>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
              ${STATUS_OPTIONS.map(opt => `<option value="${opt}" ${item.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Applied Date</label>
            <input type="date" name="appliedDate" class="form-input" value="${item.appliedDate}">
          </div>
          <div class="form-group">
            <label class="form-label">Notes (Optional)</label>
            <textarea name="note" class="form-textarea">${item.note || ''}</textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-danger btn-sm" style="margin-right:auto;" onclick="window._delInt(${id})">Delete Application</button>
            <button type="button" class="btn btn-ghost" onclick="window._closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('int-form-edit').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const company = fd.get('company').trim();
      const role = fd.get('role').trim();
      
      let valid = true;
      if (!company) { document.getElementById('err-company').style.display = 'block'; valid = false; }
      if (!role) { document.getElementById('err-role').style.display = 'block'; valid = false; }
      if (!valid) return;

      updateInternship(id, {
        company,
        role,
        status: fd.get('status'),
        appliedDate: fd.get('appliedDate'),
        note: fd.get('note')
      });
      window._closeModal();
      const { navigate } = window._router || {};
      if (navigate) navigate('internships');
    };
  };

  window._delInt = (id) => {
    if (confirm('Delete this application permanently?')) {
      deleteInternship(id);
      window._closeModal();
      const { navigate } = window._router || {};
      if (navigate) navigate('internships');
    }
  };

  window._closeModal = window._closeModal;
}
