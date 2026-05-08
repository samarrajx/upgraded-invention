// js/views/analytics.js — Charts and stats

import { getState, getSkillStats, getWeeklyData } from '../store.js';

function drawBarChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const maxVal = Math.max(...data.map(d => d.count), 5);
  const pad = 30;
  const w = rect.width - pad * 2;
  const h = rect.height - pad * 2;
  const barW = (w / data.length) * 0.6;
  const gap = (w / data.length) * 0.4;

  ctx.clearRect(0, 0, rect.width, rect.height);

  // Draw bars
  data.forEach((d, i) => {
    const barH = (d.count / maxVal) * h;
    const x = pad + i * (barW + gap) + gap / 2;
    const y = pad + h - barH;

    // Gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#7c5cfc');
    grad.addColorStop(1, '#10d9a0');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value
    if (d.count > 0) {
      ctx.fillStyle = 'var(--tx-2)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d.count, x + barW / 2, y - 5);
    }
  });
}

function drawRadarChart(canvasId, skillStats) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const radius = Math.min(cx, cy) - 40;

  const labels = Object.keys(skillStats);
  const values = labels.map(l => {
    const s = skillStats[l];
    return s.total ? s.done / s.total : 0;
  });

  const numPoints = labels.length;
  const angleStep = (Math.PI * 2) / numPoints;

  // Background web
  ctx.strokeStyle = 'var(--border-2)';
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
    const r = radius * Math.max(0.1, v);
    const x = cx + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = cy + r * Math.sin(i * angleStep - Math.PI / 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(124, 92, 252, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#7c5cfc';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'var(--tx-2)';
  ctx.font = '11px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  labels.forEach((l, i) => {
    const r = radius + 20;
    const x = cx + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = cy + r * Math.sin(i * angleStep - Math.PI / 2);
    ctx.fillText(l.toUpperCase(), x, y);
  });
}

export function render(months) {
  return `
<div class="view-analytics">
  <div class="page-header">
    <div class="page-title"><i data-lucide="trending-up" style="width:24px;height:24px;margin-right:8px;vertical-align:text-bottom;"></i> Analytics</div>
    <div class="page-subtitle">Track your consistency and skill distribution</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="section-head"><div class="section-title">Weekly Consistency</div></div>
      <canvas id="chart-weekly" style="width:100%;height:220px;"></canvas>
    </div>
    <div class="card">
      <div class="section-head"><div class="section-title">Skill Balance Radar</div></div>
      <canvas id="chart-radar" style="width:100%;height:220px;"></canvas>
    </div>
  </div>
</div>`;
}

export function mount(months) {
  setTimeout(() => {
    drawBarChart('chart-weekly', getWeeklyData(12));
    drawRadarChart('chart-radar', getSkillStats(months));
  }, 50); // slight delay for layout
}
