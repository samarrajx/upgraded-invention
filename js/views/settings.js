// js/views/settings.js — App settings and data management

import { getState, setTheme, exportData, importData, resetAll } from '../store.js';

export function render() {
  const s = getState();

  return `
<div class="view-settings" style="max-width:600px;margin:0 auto;">
  <div class="page-header">
    <div class="page-title">⚙️ Settings</div>
  </div>

  <div class="card" style="margin-bottom:var(--s4);">
    <div class="section-head"><div class="section-title">Appearance</div></div>
    <div class="toggle-wrap">
      <div class="toggle-info">
        <div class="toggle-title">Dark Mode</div>
        <div class="toggle-desc">Easier on the eyes for late night coding.</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="theme-toggle" ${s.theme==='dark'?'checked':''}>
        <div class="toggle-slider"></div>
      </label>
    </div>
  </div>

  <div class="card" style="margin-bottom:var(--s4);">
    <div class="section-head"><div class="section-title">Data Management</div></div>
    
    <div style="display:flex;flex-direction:column;gap:var(--s3);">
      <button class="btn btn-secondary" onclick="window._export()" style="justify-content:center;">
        📦 Export Backup (JSON)
      </button>
      
      <div style="position:relative;">
        <input type="file" id="import-file" accept=".json" style="position:absolute;inset:0;opacity:0;cursor:pointer;" onchange="window._import(this)">
        <button class="btn btn-secondary" style="width:100%;justify-content:center;pointer-events:none;">
          📥 Import Backup
        </button>
      </div>

      <div class="divider"></div>

      <button class="btn btn-danger" onclick="window._reset()" style="justify-content:center;">
        ⚠️ Reset All Progress
      </button>
    </div>
  </div>

  <div style="text-align:center;font-size:11px;color:var(--tx-3);margin-top:var(--s8);">
    AI Engineer Career OS v2.0<br>
    All data is stored locally on your device.
  </div>
</div>`;
}

export function mount() {
  const t = document.getElementById('theme-toggle');
  if(t) t.addEventListener('change', e => setTheme(e.target.checked ? 'dark' : 'light'));

  window._export = exportData;
  window._import = (input) => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(importData(e.target.result)) {
        alert('Data imported successfully!');
        window.location.reload();
      } else {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };
  window._reset = () => {
    if(confirm('DANGER: This will delete ALL progress, XP, and logs permanently. Are you sure?')) {
      resetAll();
      window.location.reload();
    }
  };
}
