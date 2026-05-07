// js/gamification.js — XP, badges, streaks, confetti

import { getState, awardBadge, getLevelInfo } from './store.js';

// ── Badge definitions ──
export const BADGES = [
  { id:'first_task',    icon:'🎯', name:'First Step',        desc:'Complete your first task' },
  { id:'week_done',     icon:'📅', name:'Week Warrior',      desc:'Complete a full week' },
  { id:'xp_100',        icon:'⚡', name:'Energized',         desc:'Earn 100 XP' },
  { id:'xp_500',        icon:'🔥', name:'On Fire',           desc:'Earn 500 XP' },
  { id:'xp_1000',       icon:'💎', name:'Diamond Grinder',   desc:'Earn 1000 XP' },
  { id:'streak_3',      icon:'🌟', name:'3-Day Streak',      desc:'3 days in a row' },
  { id:'streak_7',      icon:'🚀', name:'Weekly Rocket',     desc:'7-day streak' },
  { id:'streak_30',     icon:'🏆', name:'Iron Discipline',   desc:'30-day streak' },
  { id:'leet_10',       icon:'💻', name:'Code Starter',      desc:'Solve 10 LeetCode problems' },
  { id:'leet_50',       icon:'🧠', name:'Problem Solver',    desc:'Solve 50 LeetCode problems' },
  { id:'leet_100',      icon:'🎖️', name:'Centurion',         desc:'Solve 100 LeetCode problems' },
  { id:'month_done',    icon:'🗺️', name:'Month Mastered',    desc:'Complete a full month' },
  { id:'internship_1',  icon:'💼', name:'Career Hunter',     desc:'Log your first internship application' },
  { id:'interview_1',   icon:'🎤', name:'Mock Master',       desc:'Log your first mock interview' },
  { id:'level_3',       icon:'🔬', name:'Builder Rank',      desc:'Reach Level 3' },
  { id:'level_5',       icon:'🏗️', name:'Architect Rank',    desc:'Reach Level 5' },
  { id:'year_1',        icon:'🎓', name:'Year One Done',     desc:'Complete Year 1' },
];

// ── Check & award badges ──
export function checkBadges(months) {
  const s = getState();
  const done = Object.values(s.checked).filter(Boolean).length;
  const awarded = [];

  const give = (id) => { if (awardBadge(id)) awarded.push(id); };

  if (done >= 1)  give('first_task');
  if (s.xp >= 100)  give('xp_100');
  if (s.xp >= 500)  give('xp_500');
  if (s.xp >= 1000) give('xp_1000');
  if (s.streak >= 3)  give('streak_3');
  if (s.streak >= 7)  give('streak_7');
  if (s.streak >= 30) give('streak_30');
  if (s.leetcodeCount >= 10)  give('leet_10');
  if (s.leetcodeCount >= 50)  give('leet_50');
  if (s.leetcodeCount >= 100) give('leet_100');
  if (s.internships.length >= 1) give('internship_1');
  if (s.interviews.length >= 1)  give('interview_1');
  if (s.level >= 3) give('level_3');
  if (s.level >= 5) give('level_5');

  // Week complete check
  if (months) {
    months.forEach(m => {
      m.weeks.forEach((w, wi) => {
        const allDone = w.tasks.every((_, ti) => s.checked[`${m.id}_w${wi}_t${ti}`]);
        if (allDone) give('week_done');
      });
    });
    // Month complete
    months.forEach(m => {
      const allDone = m.weeks.every((w, wi) =>
        w.tasks.every((_, ti) => s.checked[`${m.id}_w${wi}_t${ti}`])
      );
      if (allDone) give('month_done');
    });
    // Year 1 complete
    const y1 = months.slice(0, 12);
    const y1Done = y1.every(m => m.weeks.every((w, wi) =>
      w.tasks.every((_, ti) => s.checked[`${m.id}_w${wi}_t${ti}`])
    ));
    if (y1Done) give('year_1');
  }

  return awarded;
}

export function getBadgeById(id) {
  return BADGES.find(b => b.id === id) || null;
}

// ── Smart suggestion engine ──
export function getSmartSuggestion(months) {
  const s = getState();
  const skillStats = {};

  months.forEach(m => m.weeks.forEach((w, wi) => {
    if (!skillStats[w.skill]) skillStats[w.skill] = { total: 0, done: 0 };
    w.tasks.forEach((_, ti) => {
      skillStats[w.skill].total++;
      if (s.checked[`${m.id}_w${wi}_t${ti}`]) skillStats[w.skill].done++;
    });
  }));

  // Find weakest skill
  let weakest = null, weakPct = 101;
  Object.entries(skillStats).forEach(([skill, { total, done }]) => {
    const pct = total ? done / total * 100 : 0;
    if (pct < weakPct) { weakPct = pct; weakest = skill; }
  });

  const TIPS = {
    dsa: 'DSA consistency is lagging. Focus: Arrays & Binary Search revision.',
    python: 'Python needs attention. Pick up from where you left off.',
    english: 'English practice builds compounding returns. Do 10 min today.',
    math: 'Math foundations matter for ML. Squeeze in one Khan Academy session.',
    projects: 'Project work shows discipline. Spend 30 min on your rebuild.',
    interview: 'Interview prep is overdue. Do one mock answer today.',
  };

  if (weakest && weakPct < 80) {
    return { type: 'weak_skill', skill: weakest, pct: Math.round(weakPct), msg: TIPS[weakest] || 'Keep pushing forward.' };
  }

  // Streak encouragement
  if (s.streak === 0) return { type: 'streak', msg: 'Start your streak today — complete any one task.' };
  if (s.streak >= 7)  return { type: 'streak', msg: `🔥 ${s.streak}-day streak! You're unstoppable.` };

  return { type: 'general', msg: 'Stay consistent. Every task is an investment in your future.' };
}

// ── Today's suggested tasks ──
export function getTodayTasks(months, count = 3) {
  const s = getState();
  const pending = [];

  for (const m of months) {
    for (let wi = 0; wi < m.weeks.length; wi++) {
      const w = m.weeks[wi];
      for (let ti = 0; ti < w.tasks.length; ti++) {
        const id = `${m.id}_w${wi}_t${ti}`;
        if (!s.checked[id]) {
          pending.push({ id, task: w.tasks[ti], skill: w.skill, monthTitle: m.badge });
        }
      }
      if (pending.length >= count * 3) break;
    }
    if (pending.length >= count * 3) break;
  }

  // Prioritize variety of skills
  const chosen = [], seenSkills = new Set();
  for (const item of pending) {
    if (!seenSkills.has(item.skill)) { chosen.push(item); seenSkills.add(item.skill); }
    if (chosen.length >= count) break;
  }
  // Fill remaining slots
  for (const item of pending) {
    if (!chosen.includes(item)) chosen.push(item);
    if (chosen.length >= count) break;
  }
  return chosen.slice(0, count);
}

// ── XP float animation ──
export function showXPFloat(element, xp) {
  const el = document.createElement('div');
  el.textContent = `+${xp} XP`;
  el.style.cssText = `
    position:fixed; pointer-events:none; z-index:9000;
    font-size:13px; font-weight:700; color:var(--amber);
    text-shadow: 0 1px 8px rgba(0,0,0,.5);
    animation: xpFloat 1.2s ease-out both;
  `;
  const rect = element.getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ── Confetti ──
export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#7c5cfc','#10d9a0','#f59e0b','#ec4899','#60a8f8','#f87171'];
  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 6 + 3,
    d: Math.random() * 4 + 1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tilt: Math.random() * 10 - 5,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    angle: 0,
  }));

  let frame = 0;
  const MAX = 120;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / MAX);
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.5, p.angle, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.d;
      p.x += Math.sin(p.angle) * 2;
      p.angle += p.tiltSpeed;
    });
    frame++;
    if (frame < MAX) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ── Toast notification ──
export function showToast(msg, icon = 'ℹ️', duration = 3000) {
  const container = document.getElementById('toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-exit');
    setTimeout(() => el.remove(), 300);
  }, duration);
}
