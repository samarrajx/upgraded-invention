// js/views/settings.js — App settings and data management

import { getState, setTheme, exportData, importData, resetAll, setDailyGoal, getDailyGoal } from '../store.js';

export function render() {
  const s = getState();
  const dailyGoal = getDailyGoal();

  return `
<div class="view-settings" style="max-width:640px;margin:0 auto; padding-bottom:var(--s12);">
  <div class="page-header" style="margin-bottom:var(--s8);">
    <div class="page-title"><i data-lucide="settings" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Settings</div>
    <div class="page-subtitle">Configure your Career OS and manage local data.</div>
  </div>

  <!-- Performance & Goals -->
  <div class="card" style="margin-bottom:var(--s5);">
    <div class="section-head"><div class="section-title"><i data-lucide="target" style="width:16px;height:16px;margin-right:8px;"></i> Performance Goals</div></div>
    <div class="form-group" style="margin-top:var(--s4);">
      <label class="form-label">Daily Task Target</label>
      <div style="display:flex; align-items:center; gap:var(--s4);">
        <input type="number" id="daily-goal-input" class="form-input" value="${dailyGoal}" min="1" max="20" style="width:80px;">
        <span style="font-size:13px; color:var(--tx-3);">tasks per day</span>
      </div>
      <p style="font-size:11px; color:var(--tx-3); margin-top:var(--s2);">Setting a realistic goal helps maintain consistency and accurate velocity tracking.</p>
    </div>
  </div>

  <!-- Appearance -->
  <div class="card" style="margin-bottom:var(--s5);">
    <div class="section-head"><div class="section-title"><i data-lucide="palette" style="width:16px;height:16px;margin-right:8px;"></i> Appearance</div></div>
    <div class="toggle-wrap" style="margin-top:var(--s4);">
      <div class="toggle-info">
        <div class="toggle-title">Dark Theme</div>
        <div class="toggle-desc">Switch between professional dark and light modes.</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="theme-toggle" ${s.theme==='dark'?'checked':''}>
        <div class="toggle-slider"></div>
      </label>
    </div>
  </div>

  <!-- Installation -->
  <div class="card" id="install-card" style="margin-bottom:var(--s5); display:none; border:1px solid var(--primary-dim); background:var(--primary-dim-2);">
    <div class="section-head"><div class="section-title"><i data-lucide="download-cloud" style="width:16px;height:16px;margin-right:8px;"></i> Desktop / Mobile App</div></div>
    <div style="display:flex; flex-direction:column; gap:var(--s3); margin-top:var(--s2);">
      <p style="font-size:13px; color:var(--tx-2); line-height:1.5;">Install Career OS for a standalone experience with offline support and faster access.</p>
      <button class="btn btn-primary" onclick="window._installPwa()" style="justify-content:center; width:100%;">
        <i data-lucide="plus-circle" style="width:18px;height:18px;margin-right:8px;"></i> Install Now
      </button>
    </div>
  </div>

  <!-- Data Management -->
  <div class="card" style="margin-bottom:var(--s5);">
    <div class="section-head"><div class="section-title"><i data-lucide="database" style="width:16px;height:16px;margin-right:8px;"></i> Data & Backup</div></div>
    
    <div style="display:flex; flex-direction:column; gap:var(--s4); margin-top:var(--s4);">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--s3);">
        <button class="btn btn-secondary" onclick="window._export()" style="justify-content:center;">
          <i data-lucide="download" style="width:18px;height:18px;margin-right:8px;"></i> Export
        </button>
        
        <div style="position:relative;">
          <input type="file" id="import-file" accept=".json" style="position:absolute;inset:0;opacity:0;cursor:pointer;" onchange="window._import(this)">
          <button class="btn btn-secondary" style="width:100%;justify-content:center;pointer-events:none;">
            <i data-lucide="upload" style="width:18px;height:18px;margin-right:8px;"></i> Import
          </button>
        </div>
      </div>

      <div style="border-top:1px solid var(--surface-3); padding-top:var(--s4);">
        <button class="btn btn-ghost" style="width:100%; justify-content:center; color:var(--rose);" onclick="window._resetConfirm()">
          <i data-lucide="trash-2" style="width:18px;height:18px;margin-right:8px;"></i> Reset All Progress
        </button>
      </div>
    </div>
  </div>

  <div style="text-align:center; padding:var(--s8) 0;">
    <div style="font-size:13px; font-weight:800; color:var(--primary); margin-bottom:4px;">CAREER OS V2.5</div>
    <div style="font-size:11px; color:var(--tx-3); line-height:1.4;">
      Built for AI Engineers. All data is encrypted and stored locally in your browser's IndexedDB/LocalStorage.
    </div>
  </div>
</div>`;
}

export function mount() {
  // Theme Toggle
  const t = document.getElementById('theme-toggle');
  if(t) t.addEventListener('change', e => setTheme(e.target.checked ? 'dark' : 'light'));

  // Daily Goal
  const goalInput = document.getElementById('daily-goal-input');
  if (goalInput) {
    goalInput.addEventListener('change', e => {
      const val = parseInt(e.target.value);
      if (val > 0 && val <= 50) {
        setDailyGoal(val);
        import('../gamification.js').then(m => m.showToast(`Daily goal updated to ${val} tasks`, 'success'));
      }
    });
  }

  window._export = exportData;
  window._import = (input) => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(importData(e.target.result)) {
        import('../gamification.js').then(m => m.showToast('Data imported successfully!', 'success'));
        setTimeout(() => window.location.reload(), 1500);
      } else {
        import('../gamification.js').then(m => m.showToast('Invalid backup file.', 'error'));
      }
    };
    reader.readAsText(file);
  };

  window._resetConfirm = () => {
    window._openModal(`
      <div class="modal">
        <div class="modal-title" style="color:var(--rose);">Reset All Progress?</div>
        <p style="font-size:14px; color:var(--tx-2); line-height:1.6; margin-bottom:var(--s6);">
          This action will permanently delete all your roadmap progress, XP, streak data, leetcode logs, and internship applications. This cannot be undone.
        </p>
        <div class="modal-actions">
          <button class="btn btn-ghost" onclick="window._closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="window._doReset()">Yes, Reset Everything</button>
        </div>
      </div>
    `);
  };

  window._doReset = () => {
    resetAll();
    window.location.reload();
  };

  // PWA Install Logic
  const installCard = document.getElementById('install-card');
  const checkInstall = () => {
    if (window._getPwaPrompt()) {
      installCard.style.display = 'block';
    }
  };

  checkInstall();
  window.addEventListener('pwa:install-available', checkInstall);

  window._installPwa = async () => {
    const prompt = window._getPwaPrompt();
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window._clearPwaPrompt();
      installCard.style.display = 'none';
    }
  };

  if (window.lucide) window.lucide.createIcons();
}
