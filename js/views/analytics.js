// js/views/analytics.js — Charts and stats

import { getState, getSkillStats, getWeeklyData, getBurndownData, getMonthlyVelocity } from '../store.js';

// ── Generic Chart Helpers ──

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  return { ctx, w: rect.width, h: rect.height };
}

function drawBarChart(canvasId, data, colorStart = '#7c5cfc', colorEnd = '#10d9a0') {
  const res = setupCanvas(canvasId);
  if (!res) return;
  const { ctx, w, h } = res;

  const maxVal = Math.max(...data.map(d => d.count), 1);
  const pad = 30;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const barW = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;

  ctx.clearRect(0, 0, w, h);

  data.forEach((d, i) => {
    const barH = (d.count / maxVal) * chartH;
    const x = pad + i * (barW + gap) + gap / 2;
    const y = pad + chartH - barH;

    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, colorStart);
    grad.addColorStop(1, colorEnd);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    if (d.count > 0 && data.length < 20) {
      ctx.fillStyle = 'var(--tx-2)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d.count, x + barW / 2, y - 5);
    }
  });
}

function drawLineChart(canvasId, actualData, expectedData, labels) {
  const res = setupCanvas(canvasId);
  if (!res) return;
  const { ctx, w, h } = res;

  const maxVal = Math.max(...actualData, ...expectedData, 1);
  const pad = 30;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;

  ctx.clearRect(0, 0, w, h);

  // Axes
  ctx.strokeStyle = 'var(--surface-3)';
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + chartH);
  ctx.lineTo(pad + chartW, pad + chartH);
  ctx.stroke();

  function drawLine(data, color, dashed = false) {
    ctx.strokeStyle = color;
    ctx.setLineDash(dashed ? [5, 5] : []);
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad + (i / (data.length - 1)) * chartW;
      const y = pad + chartH - (v / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // Draw Expected (dashed)
  drawLine(expectedData, 'rgba(255,255,255,0.1)', true);
  // Draw Actual
  drawLine(actualData, 'var(--primary)');
  
  ctx.setLineDash([]);
}

function drawRadarChart(canvasId, skillStats) {
  const res = setupCanvas(canvasId);
  if (!res) return;
  const { ctx, w, h } = res;

  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 45;

  const labels = Object.keys(skillStats);
  const values = labels.map(l => {
    const s = skillStats[l];
    return s.total ? s.done / s.total : 0;
  });

  const numPoints = labels.length;
  const angleStep = (Math.PI * 2) / numPoints;

  ctx.clearRect(0, 0, w, h);

  // Background web
  ctx.strokeStyle = 'var(--surface-3)';
  ctx.lineWidth = 1;
  for (let level = 1; level <= 5; level++) {
    const r = radius * (level / 5);
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const x = cx + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = cy + r * Math.sin(i * angleStep - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Data shape
  ctx.beginPath();
  values.forEach((v, i) => {
    const r = radius * Math.max(0.05, v);
    const x = cx + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = cy + r * Math.sin(i * angleStep - Math.PI / 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(124, 92, 252, 0.2)';
  ctx.fill();
  ctx.strokeStyle = 'var(--primary)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'var(--tx-2)';
  ctx.font = '10px Inter';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    const r = radius + 20;
    const x = cx + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = cy + r * Math.sin(i * angleStep - Math.PI / 2);
    ctx.fillText(l.toUpperCase(), x, y);
  });
}

export function render(months) {
  return `
<div class="view-analytics anim-stagger">
  <div class="page-header" style="margin-bottom:var(--s8);">
    <div class="page-title"><i data-lucide="trending-up" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Analytics Dashboard</div>
    <div class="page-subtitle">Visualizing your growth and curriculum progression.</div>
  </div>

  <div class="grid-2">
    <!-- Weekly Activity -->
    <div class="card">
      <div class="section-head"><div class="section-title">Weekly Intensity</div></div>
      <canvas id="chart-weekly" style="width:100%;height:200px;"></canvas>
    </div>

    <!-- Skill Balance -->
    <div class="card">
      <div class="section-head"><div class="section-title">Skill Mastery Radar</div></div>
      <canvas id="chart-radar" style="width:100%;height:200px;"></canvas>
    </div>

    <!-- Burndown -->
    <div class="card">
      <div class="section-head">
        <div class="section-title">Roadmap Burndown</div>
        <div style="font-size:11px; color:var(--tx-3);">Expected vs. Actual</div>
      </div>
      <canvas id="chart-burndown" style="width:100%;height:200px;"></canvas>
    </div>

    <!-- Monthly Velocity -->
    <div class="card">
      <div class="section-head"><div class="section-title">Monthly Completion (%)</div></div>
      <canvas id="chart-velocity" style="width:100%;height:200px;"></canvas>
    </div>

    <!-- LeetCode Growth -->
    <div class="card" style="grid-column: 1 / -1;">
      <div class="section-head"><div class="section-title">LeetCode Cumulative Growth</div></div>
      <canvas id="chart-leetcode" style="width:100%;height:200px;"></canvas>
    </div>
  </div>
</div>`;
}

export function mount(months) {
  setTimeout(() => {
    // 1. Weekly Activity
    drawBarChart('chart-weekly', getWeeklyData(12));

    // 2. Skill Radar
    drawRadarChart('chart-radar', getSkillStats(months));

    // 3. Burndown
    const burn = getBurndownData(months);
    // Create interpolation for actual progress over time is hard with current store, 
    // so we just show two points: [0, todayActual] vs [0, todayExpected]
    // Or just show total vs done. Let's do a simple 2-point line for now.
    drawLineChart('chart-burndown', [0, burn.actualDone], [0, burn.expectedDone], ['Start', 'Now']);

    // 4. Monthly Velocity
    const velocityData = getMonthlyVelocity(months).slice(0, 12).map(v => ({ count: v.pct }));
    drawBarChart('chart-velocity', velocityData, '#10d9a0', '#0ea5e9');

    // 5. LeetCode Growth
    const lcLog = getState().leetcodeLog || [];
    const lcData = lcLog.length ? lcLog.map(l => l.count) : [0, 0];
    drawLineChart('chart-leetcode', lcData, lcData.map((_, i) => (i/lcData.length) * (lcData[lcData.length-1] || 100)), []);

    if (window.lucide) window.lucide.createIcons();
  }, 100);
}
