// js/views/settings.js — App settings and data management

import { 
  getState, setTheme, exportData, importData, resetAll, setDailyGoal, getDailyGoal,
  getLevelInfo, getProgressStats, getSkillStats, getWeeklyData
} from '../store.js';
import { showToast } from '../gamification.js';

// ── Utility: draw rounded rectangle ──
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Utility: draw a donut arc ──
function drawArc(ctx, cx, cy, r, start, end, color, width) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, start, end);
  ctx.strokeStyle = color;
  ctx.lineWidth   = width;
  ctx.lineCap     = 'round';
  ctx.stroke();
}

export async function generateReport(months) {
  const state    = getState();
  const level    = getLevelInfo();
  const progress = getProgressStats(months);
  const skills   = getSkillStats(months);
  const weekly   = getWeeklyData(12);

  const W = 1200, H = 1800;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const FONT = "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif";

  // ── Color palette ──
  const C = {
    bg:       '#0D0F1A',
    bg2:      '#131627',
    surface:  '#1A1D2E',
    surface2: '#21253A',
    border:   'rgba(255,255,255,0.08)',
    primary:  '#7C6FF7',     // violet
    accent:   '#2DD4A0',     // emerald
    amber:    '#F59E0B',
    rose:     '#F06080',
    sky:      '#38BDF8',
    tx:       '#EDF0F8',
    tx2:      '#9BA3C0',
    tx3:      '#5C6380',
    skillColors: {
      python:   '#3B82F6',
      dsa:      '#EF4444',
      english:  '#22C55E',
      math:     '#F59E0B',
      projects: '#8B5CF6',
      interview:'#EC4899',
      system:   '#0EA5E9',
    }
  };

  // ── 1. BACKGROUND ──
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid lines (very faint)
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth   = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // ── 2. HEADER SECTION ──
  // Gradient band at top (160px tall)
  const headerGrad = ctx.createLinearGradient(0, 0, W, 160);
  headerGrad.addColorStop(0,   'rgba(124,111,247,0.25)');
  headerGrad.addColorStop(0.5, 'rgba(45,212,160,0.10)');
  headerGrad.addColorStop(1,   'rgba(124,111,247,0.05)');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, 160);

  // Top border line (glowing)
  const topLine = ctx.createLinearGradient(0, 0, W, 0);
  topLine.addColorStop(0,   'rgba(124,111,247,0)');
  topLine.addColorStop(0.3, 'rgba(124,111,247,0.9)');
  topLine.addColorStop(0.7, 'rgba(45,212,160,0.9)');
  topLine.addColorStop(1,   'rgba(45,212,160,0)');
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 0, W, 3);

  // App name
  ctx.font      = \`800 52px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Career OS', 60, 68);

  // "Progress Report" badge
  const badgeW = 220, badgeH = 36, badgeX = 60, badgeY = 84;
  ctx.fillStyle = 'rgba(124,111,247,0.18)';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
  ctx.fill();
  ctx.font      = \`600 15px \${FONT}\`;
  ctx.fillStyle = C.primary;
  ctx.textAlign = 'left';
  ctx.fillText('PROGRESS REPORT', badgeX + 16, badgeY + 23);

  // Right: generated date
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year:'numeric', month:'long', day:'numeric'
  });
  ctx.font      = \`500 18px \${FONT}\`;
  ctx.fillStyle = C.tx2;
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, W - 60, 68);
  ctx.font      = \`500 15px \${FONT}\`;
  ctx.fillText('Target: ₹20–30 LPA · BCA 2028', W - 60, 95);

  let y = 195; // current Y cursor

  // ── 3. HERO STATS — 4 cards ──
  const heroStats = [
    { label:'Tasks Done',    value: progress.done,          sub: \`of \${progress.total} total\`,   color: C.primary },
    { label:'XP Earned',     value: state.xp.toLocaleString(), sub: \`Level \${level.level} — \${level.title}\`, color: C.accent  },
    { label:'Day Streak',    value: state.streak,           sub: \`best: \${state.longestStreak||0} days\`, color: C.amber   },
    { label:'Leetcode',      value: state.leetcodeCount,    sub: 'problems solved',              color: C.sky     },
  ];
  const cardW = 248, cardH = 140, cardGap = 16;
  const heroX  = 60;

  heroStats.forEach((stat, i) => {
    const cx = heroX + i * (cardW + cardGap);

    // Card background
    ctx.fillStyle = C.surface;
    roundRect(ctx, cx, y, cardW, cardH, 16);
    ctx.fill();

    // Left accent bar
    ctx.fillStyle = stat.color;
    roundRect(ctx, cx, y, 4, cardH, 2);
    ctx.fill();

    // Top-right color dot / glow circle
    ctx.beginPath();
    ctx.arc(cx + cardW - 28, y + 28, 20, 0, Math.PI * 2);
    ctx.fillStyle = stat.color + '22'; // 13% opacity
    ctx.fill();

    // Value (big number)
    ctx.font      = \`800 44px \${FONT}\`;
    ctx.fillStyle = C.tx;
    ctx.textAlign = 'left';
    ctx.fillText(String(stat.value), cx + 22, y + 68);

    // Label
    ctx.font      = \`600 13px \${FONT}\`;
    ctx.fillStyle = stat.color;
    ctx.fillText(stat.label.toUpperCase(), cx + 22, y + 30);

    // Sub-text
    ctx.font      = \`400 13px \${FONT}\`;
    ctx.fillStyle = C.tx2;
    ctx.fillText(stat.sub, cx + 22, y + 100);
  });

  y += cardH + 40;

  // ── 4. LEVEL + XP BAR ──
  // Section header
  ctx.font      = \`700 22px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Level Progress', 60, y);

  y += 16;

  // XP bar track
  const barX = 60, barW = W - 120, barH = 28;
  ctx.fillStyle = C.surface2;
  roundRect(ctx, barX, y, barW, barH, 14);
  ctx.fill();

  // XP bar fill
  const fillW = Math.round(barW * (level.pct / 100));
  const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
  barGrad.addColorStop(0, C.primary);
  barGrad.addColorStop(1, C.accent);
  ctx.fillStyle = barGrad;
  roundRect(ctx, barX, y, fillW, barH, 14);
  ctx.fill();

  // Bar text (centered on bar)
  ctx.font      = \`700 13px \${FONT}\`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(\`Level \${level.level} — \${level.title}\`, barX + barW / 2, y + 18);

  // Next level text
  ctx.font      = \`500 13px \${FONT}\`;
  ctx.fillStyle = C.tx2;
  ctx.textAlign = 'right';
  const nextLabel = level.nextXP
    ? \`\${level.pct}% to Level \${level.level + 1} (\${level.nextXP} XP)\`
    : 'MAX LEVEL';
  ctx.fillText(nextLabel, W - 60, y + barH + 20);

  y += barH + 52;

  // ── 5. OVERALL PROGRESS — large donut + percentage ──
  ctx.font      = \`700 22px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Overall Roadmap Progress', 60, y);
  y += 20;

  const donutCX = W / 2, donutCY = y + 170, donutR = 140, donutW = 22;
  const angle   = (progress.pct / 100) * Math.PI * 2 - Math.PI / 2;

  // Track
  drawArc(ctx, donutCX, donutCY, donutR, 0, Math.PI * 2, C.surface2, donutW);
  // Fill
  if (progress.done > 0) {
    const fillGrad = ctx.createLinearGradient(
      donutCX - donutR, donutCY, donutCX + donutR, donutCY
    );
    fillGrad.addColorStop(0, C.primary);
    fillGrad.addColorStop(1, C.accent);
    ctx.strokeStyle = fillGrad;
    ctx.lineWidth   = donutW;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.arc(donutCX, donutCY, donutR, -Math.PI / 2, angle);
    ctx.stroke();
  }

  // Center text
  ctx.textAlign = 'center';
  ctx.font      = \`800 72px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.fillText(\`\${progress.pct}%\`, donutCX, donutCY + 16);
  ctx.font      = \`500 18px \${FONT}\`;
  ctx.fillStyle = C.tx2;
  ctx.fillText(\`\${progress.done} of \${progress.total} tasks\`, donutCX, donutCY + 46);

  y = donutCY + donutR + 52;

  // ── 6. SKILL BREAKDOWN — horizontal bars ──
  ctx.font      = \`700 22px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Skill Breakdown', 60, y);
  y += 20;

  const skillKeys = Object.keys(skills).filter(k => skills[k].total > 0);
  const skillBarH = 36, skillGap = 14;
  const skillBarMaxW = W - 340;
  const skillBarX    = 200;

  skillKeys.forEach(skill => {
    const { done: sd, total: st } = skills[skill];
    const pct  = st ? Math.round(sd / st * 100) : 0;
    const color = C.skillColors[skill] || C.primary;

    // Row background
    ctx.fillStyle = C.surface;
    roundRect(ctx, 60, y, W - 120, skillBarH, 10);
    ctx.fill();

    // Skill name
    ctx.font      = \`600 14px \${FONT}\`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(skill.toUpperCase(), 80, y + 23);

    // Bar track
    ctx.fillStyle = C.surface2;
    roundRect(ctx, skillBarX, y + 8, skillBarMaxW, 20, 10);
    ctx.fill();

    // Bar fill
    if (pct > 0) {
      const fw = Math.round(skillBarMaxW * (pct / 100));
      ctx.fillStyle = color + 'CC'; // 80% opacity
      roundRect(ctx, skillBarX, y + 8, fw, 20, 10);
      ctx.fill();
    }

    // Percentage
    ctx.font      = \`700 14px \${FONT}\`;
    ctx.fillStyle = C.tx;
    ctx.textAlign = 'right';
    ctx.fillText(\`\${pct}%  (\${sd}/\${st})\`, W - 70, y + 23);

    y += skillBarH + skillGap;
  });

  y += 30;

  // ── 7. WEEKLY ACTIVITY — bar chart (last 12 weeks) ──
  ctx.font      = \`700 22px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Weekly Activity (Last 12 Weeks)', 60, y);
  y += 22;

  const wData   = weekly; // array of { week, count } from getWeeklyData(12)
  const wMax    = Math.max(...wData.map(d => d.count), 1);
  const wBarW   = Math.floor((W - 160) / wData.length) - 6;
  const wBarMaxH= 100;
  const wBaseY  = y + wBarMaxH + 10;

  wData.forEach((d, i) => {
    const bh  = wMax ? Math.round((d.count / wMax) * wBarMaxH) : 0;
    const bx  = 80 + i * (wBarW + 6);
    const by  = wBaseY - bh;

    // Bar
    const barC = ctx.createLinearGradient(0, by, 0, wBaseY);
    barC.addColorStop(0, C.primary);
    barC.addColorStop(1, C.primary + '44');
    ctx.fillStyle = bh > 0 ? barC : C.surface2;
    roundRect(ctx, bx, by, wBarW, bh || 4, 4);
    ctx.fill();

    // Week label (tiny, below bar)
    ctx.font      = \`500 11px \${FONT}\`;
    ctx.fillStyle = C.tx3;
    ctx.textAlign = 'center';
    const wLabel = d.week ? \`W\${d.week.split('W')[1] || i+1}\` : \`W\${i+1}\`;
    ctx.fillText(wLabel, bx + wBarW / 2, wBaseY + 16);

    // Count on top of bar
    if (d.count > 0) {
      ctx.font      = \`600 12px \${FONT}\`;
      ctx.fillStyle = C.tx2;
      ctx.fillText(d.count, bx + wBarW / 2, by - 4);
    }
  });

  y = wBaseY + 36;

  // ── 8. APPLICATIONS + INTERVIEWS row ──
  const s = getState();
  const appCount  = s.internships?.length ?? 0;
  const intCount  = s.interviews?.length ?? 0;
  const avgConf   = intCount > 0
    ? (s.interviews.reduce((sum, i) => sum + (i.confidence||0), 0) / intCount).toFixed(1)
    : '—';

  ctx.font      = \`700 22px \${FONT}\`;
  ctx.fillStyle = C.tx;
  ctx.textAlign = 'left';
  ctx.fillText('Applications & Interviews', 60, y);
  y += 20;

  const appStats = [
    { label:'Applications', value: appCount, color: C.sky   },
    { label:'Mock Sessions', value: intCount, color: C.amber  },
    { label:'Avg Confidence', value: \`\${avgConf}/5\`, color: C.accent },
    { label:'LeetCode Total', value: s.leetcodeCount, color: C.rose  },
  ];
  const appCardW = 248, appCardH = 110;

  appStats.forEach((stat, i) => {
    const cx = 60 + i * (appCardW + cardGap);
    ctx.fillStyle = C.surface;
    roundRect(ctx, cx, y, appCardW, appCardH, 14);
    ctx.fill();
    ctx.fillStyle = stat.color + '33';
    roundRect(ctx, cx, y, appCardW, appCardH, 14);
    ctx.fill();
    ctx.fillStyle = stat.color;
    roundRect(ctx, cx, y, appCardW, 3, 14);
    ctx.fill();

    ctx.font      = \`800 40px \${FONT}\`;
    ctx.fillStyle = C.tx;
    ctx.textAlign = 'left';
    ctx.fillText(String(stat.value), cx + 20, y + 62);
    ctx.font      = \`600 13px \${FONT}\`;
    ctx.fillStyle = C.tx2;
    ctx.fillText(stat.label, cx + 20, y + 86);
  });

  y += appCardH + 60;

  // ── 9. FOOTER ──
  // Gradient band at bottom (80px tall)
  const footGrad = ctx.createLinearGradient(0, H - 80, 0, H);
  footGrad.addColorStop(0, 'transparent');
  footGrad.addColorStop(1, 'rgba(124,111,247,0.12)');
  ctx.fillStyle = footGrad;
  ctx.fillRect(0, H - 80, W, 80);

  // Bottom border line
  const btmLine = ctx.createLinearGradient(0, 0, W, 0);
  btmLine.addColorStop(0,   'rgba(45,212,160,0)');
  btmLine.addColorStop(0.3, 'rgba(45,212,160,0.8)');
  btmLine.addColorStop(0.7, 'rgba(124,111,247,0.8)');
  btmLine.addColorStop(1,   'rgba(124,111,247,0)');
  ctx.fillStyle = btmLine;
  ctx.fillRect(0, H - 3, W, 3);

  ctx.font      = \`500 16px \${FONT}\`;
  ctx.fillStyle = C.tx3;
  ctx.textAlign = 'left';
  ctx.fillText('Generated by Career OS', 60, H - 30);
  ctx.textAlign = 'right';
  ctx.fillText(\`Keep going. Every task compounds.\`, W - 60, H - 30);

  // ── DOWNLOAD ──
  const dataURL = canvas.toDataURL('image/png');
  const link    = document.createElement('a');
  const today   = new Date().toISOString().split('T')[0];
  link.download  = \`career-os-report-\${today}.png\`;
  link.href      = dataURL;
  link.click();
}

export function render(months) {
  const s = getState();
  const dailyGoal = getDailyGoal();

  return \`
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
        <input type="number" id="daily-goal-input" class="form-input" value="\${dailyGoal}" min="1" max="20" style="width:80px;">
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
        <input type="checkbox" id="theme-toggle" \${s.theme==='dark'?'checked':''}>
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
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);">
        <!-- JSON backup (existing) -->
        <button class="btn btn-secondary" onclick="window._exportJSON()" style="justify-content:center;">
          <i data-lucide="download" style="width:16px;height:16px;margin-right:6px;"></i> Backup JSON
        </button>
        <!-- New: Visual report -->
        <button class="btn btn-primary" onclick="window._exportReport()" id="export-report-btn" style="justify-content:center;">
          <i data-lucide="image" style="width:16px;height:16px;margin-right:6px;"></i> Export Report
        </button>
      </div>
      <p style="font-size:11px;color:var(--tx-3);margin-top:var(--s2);">
        JSON backup for data safety · Report PNG is shareable &amp; printable
      </p>

      <div style="position:relative; margin-top: var(--s2);">
        <input type="file" id="import-file" accept=".json" style="position:absolute;inset:0;opacity:0;cursor:pointer;" onchange="window._import(this)">
        <button class="btn btn-secondary" style="width:100%;justify-content:center;pointer-events:none;">
          <i data-lucide="upload" style="width:18px;height:18px;margin-right:8px;"></i> Import JSON
        </button>
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
</div>\`;
}

export function mount(months) {
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
        showToast(\`Daily goal updated to \${val} tasks\`, 'success');
      }
    });
  }

  // JSON export
  window._exportJSON = () => exportData();

  // Visual report export
  window._exportReport = async () => {
    const btn = document.getElementById('export-report-btn');
    if (btn) {
      btn.textContent = 'Generating...';
      btn.disabled = true;
    }
    // Small delay so button UI updates before canvas blocks thread
    await new Promise(r => setTimeout(r, 50));
    try {
      await document.fonts.ready;
      await generateReport(months);
      showToast('Report downloaded!', 'success');
    } catch (e) {
      console.error('Report generation failed:', e);
      showToast('Report failed. Try again.', 'error');
    }
    if (btn) {
      btn.innerHTML = '<i data-lucide="image" style="width:16px;height:16px;margin-right:6px;"></i> Export Report';
      btn.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  window._import = (input) => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(importData(e.target.result)) {
        showToast('Data imported successfully!', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast('Invalid backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  window._resetConfirm = () => {
    window._openModal(\`
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
    \`);
  };

  window._doReset = () => {
    resetAll();
    window.location.reload();
  };

  // PWA Install Logic
  const installCard = document.getElementById('install-card');
  const checkInstall = () => {
    if (window._getPwaPrompt && window._getPwaPrompt()) {
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
