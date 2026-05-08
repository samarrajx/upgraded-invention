// js/views/dashboard.js — Command Center

import { getState, getLevelInfo, getProgressStats, getSkillStats, getTodayCount } from '../store.js';
import { SKILL_LABELS } from '../data.js';
import { getTodayTasks, getSmartSuggestion, BADGES, showToast } from '../gamification.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function daysUntilBCA() {
  const target = new Date('2028-06-01');
  const diff = Math.ceil((target - new Date()) / 86400000);
  return diff > 0 ? diff : 0;
}

function skillBar(skill, done, total) {
  const pct = total ? Math.round(done / total * 100) : 0;
  const colors = {
    python:'var(--s-py-pr)', dsa:'var(--s-ds-pr)', english:'var(--s-en-pr)',
    math:'var(--s-ma-pr)', projects:'var(--s-pr-pr)', interview:'var(--s-in-pr)',
    system:'var(--s-sy-pr)',
  };
  return `
    <div class="skill-row">
      <div class="skill-row-top">
        <span class="skill-badge skill-${skill}">${SKILL_LABELS[skill]||skill}</span>
        <span class="skill-pct">${pct}%</span>
      </div>
      <div class="prog-wrap prog-sm" style="margin-top:6px;">
        <div class="prog-fill" style="width:${pct}%;background:${colors[skill]||'var(--primary)'};"></div>
      </div>
    </div>`;
}

function renderTodayTask({ id, task, skill, monthTitle }) {
  const s = getState();
  const done = !!s.checked[id];
  return `
    <div class="task-row today-task" data-id="${id}" data-xp="${task.xp||10}" style="${done?'opacity:.5':''}">
      <div class="task-check ${done?'done':''}">${done?'<i data-lucide="check" style="width:12px;height:12px;"></i>':''}</div>
      <div class="task-info">
        <div class="task-name ${done?'done':''}">${task.t}</div>
        <div class="task-sub">${monthTitle} · <span class="skill-badge skill-${skill}" style="font-size:9px;padding:1px 6px;">${skill}</span></div>
      </div>
      <div class="task-xp">+${task.xp||10} XP</div>
    </div>`;
}

function renderBadge(id) {
  const b = BADGES.find(x => x.id === id);
  if (!b) return '';
  return `<div class="badge-chip" title="${b.desc}"><i data-lucide="${b.icon}" style="width:18px;height:18px;"></i><span>${b.name}</span></div>`;
}

export function render(months) {
  const s = getState();
  const lv = getLevelInfo();
  const prog = getProgressStats(months);
  const skills = getSkillStats(months);
  const todayTasks = getTodayTasks(months, 3);
  const suggestion = getSmartSuggestion(months);
  const recentBadges = s.badges.slice(-4).reverse();
  const todayCount = getTodayCount();

  const sgIcon = { weak_skill:'target', streak:'flame', general:'lightbulb' }[suggestion.type] || 'lightbulb';

  return `
<div class="view-dashboard">

  <div class="dash-header">
    <div>
      <div class="dash-greeting">${greeting()}, Samar <i data-lucide="hand" style="width:20px;height:20px;margin-bottom:-4px;"></i></div>
      <div class="dash-date">${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div class="dash-streak ${s.streak>0?'active':''}">
      <i data-lucide="flame" class="flame-icon"></i>
      <span class="streak-num">${s.streak}</span>
      <span class="streak-label">day streak</span>
    </div>
  </div>

  <div class="xp-hero card" style="margin-bottom:var(--s5);">
    <div class="xp-hero-top">
      <div>
        <div class="xp-title">Level ${lv.level} — <span style="color:var(--primary)">${lv.title}</span></div>
        <div class="xp-sub">${s.xp.toLocaleString()} XP total${lv.nextXP ? ` · ${lv.nextXP - s.xp} to next level` : ' · MAX LEVEL'}</div>
      </div>
      <div class="xp-badge-big">L${lv.level}</div>
    </div>
    <div class="prog-wrap" style="margin-top:var(--s3);height:8px;">
      <div class="prog-fill" style="width:${lv.pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:999px;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:4px;">
      <span style="font-size:10px;color:var(--tx-3)">L${lv.level}</span>
      <span style="font-size:10px;color:var(--tx-3)">${lv.pct}%</span>
      <span style="font-size:10px;color:var(--tx-3)">${lv.nextXP?'L'+(lv.level+1):''}</span>
    </div>
  </div>

  <div class="grid-4 anim-stagger" style="margin-bottom:var(--s5);">
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--primary-dim);"><i data-lucide="map"></i></div>
      <div class="stat-card-value">${prog.pct}%</div>
      <div class="stat-card-label">Roadmap Progress</div>
      <div class="stat-card-sub">${prog.done} / ${prog.total} tasks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--amber-dim);"><i data-lucide="flame"></i></div>
      <div class="stat-card-value">${s.streak}</div>
      <div class="stat-card-label">Day Streak</div>
      <div class="stat-card-sub">Best: ${s.longestStreak} days</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--sky-dim);"><i data-lucide="code"></i></div>
      <div class="stat-card-value">${s.leetcodeCount}</div>
      <div class="stat-card-label">LeetCode Solved</div>
      <div class="stat-card-sub">
        <a href="#" id="dash-leet-btn" style="color:var(--primary);font-weight:600;">Update count →</a>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:var(--accent-dim);"><i data-lucide="calendar"></i></div>
      <div class="stat-card-value">${daysUntilBCA()}</div>
      <div class="stat-card-label">Days to Graduation</div>
      <div class="stat-card-sub">Target: ₹20–30 LPA</div>
    </div>
  </div>

  <div class="card suggestion-card" style="margin-bottom:var(--s5);border-left:3px solid var(--primary);">
    <div style="display:flex;gap:var(--s3);align-items:flex-start;">
      <span style="font-size:24px;color:var(--primary);"><i data-lucide="${sgIcon}"></i></span>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--tx);margin-bottom:3px;">Smart Focus</div>
        <div style="font-size:13px;color:var(--tx-2);line-height:1.5;">${suggestion.msg}</div>
        ${suggestion.skill ? `<a class="btn btn-sm btn-primary" style="margin-top:var(--s3);display:inline-flex;" href="#roadmap">Go to Roadmap →</a>` : ''}
      </div>
    </div>
  </div>

  <div class="grid-2" style="gap:var(--s5);margin-bottom:var(--s5);">
    <div>
      <div class="section-head">
        <div class="section-title"><i data-lucide="target" style="width:16px;height:16px;"></i> Today's Focus</div>
        <span style="font-size:11px;color:var(--tx-3)">${todayCount} done today</span>
      </div>
      <div class="card card-sm today-tasks-list">
        ${todayTasks.length
          ? todayTasks.map(renderTodayTask).join('')
          : `<div class="empty-state" style="padding:var(--s8);">
               <div class="empty-state-icon"><i data-lucide="check-circle" style="width:48px;height:48px;opacity:0.3;"></i></div>
               <div class="empty-state-title">All caught up!</div>
             </div>`
        }
        <div style="margin-top:var(--s3);text-align:center;">
          <a href="#focus" class="btn btn-ghost btn-sm">Open Focus Mode →</a>
        </div>
      </div>
    </div>

    <div>
      <div class="section-head">
        <div class="section-title"><i data-lucide="bar-chart-3" style="width:16px;height:16px;"></i> Skill Progress</div>
        <a href="#analytics" style="font-size:11px;color:var(--primary);">Full analytics →</a>
      </div>
      <div class="card card-sm">
        ${Object.entries(skills).map(([sk, { done, total }]) => skillBar(sk, done, total)).join('')}
      </div>
    </div>
  </div>

  ${recentBadges.length ? `
  <div style="margin-bottom:var(--s5);">
    <div class="section-head">
      <div class="section-title"><i data-lucide="award" style="width:16px;height:16px;"></i> Recent Badges</div>
      <span style="font-size:11px;color:var(--tx-3)">${s.badges.length} earned</span>
    </div>
    <div class="badges-row">
      ${recentBadges.map(renderBadge).join('')}
    </div>
  </div>` : ''}

  <div class="section-head"><div class="section-title"><i data-lucide="zap" style="width:16px;height:16px;"></i> Quick Actions</div></div>
  <div class="quick-actions">
    <a href="#focus"       class="btn btn-primary"><i data-lucide="target"></i> Focus Mode</a>
    <a href="#roadmap"     class="btn btn-secondary"><i data-lucide="map"></i> Roadmap</a>
    <a href="#internships" class="btn btn-secondary"><i data-lucide="briefcase"></i> Log Internship</a>
    <a href="#interviews"  class="btn btn-secondary"><i data-lucide="mic"></i> Log Interview</a>
    <a href="#heatmap"     class="btn btn-secondary"><i data-lucide="calendar"></i> Heatmap</a>
  </div>

</div>

<style>
.dash-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--s6);flex-wrap:wrap;gap:var(--s3);}
.dash-greeting{font-size:24px;font-weight:800;letter-spacing:-.03em;}
.dash-date{font-size:13px;color:var(--tx-3);margin-top:2px;}
.dash-streak{display:flex;align-items:center;gap:6px;background:var(--amber-dim);border:1px solid var(--amber);border-radius:var(--r-lg);padding:var(--s2) var(--s4);}
.dash-streak.active{animation:xpPulse 2s ease-in-out infinite;}
.streak-num{font-size:22px;font-weight:800;color:var(--amber);}
.streak-label{font-size:12px;color:var(--amber);font-weight:500;}
.xp-hero-top{display:flex;align-items:flex-start;justify-content:space-between;}
.xp-title{font-size:16px;font-weight:700;}
.xp-sub{font-size:12px;color:var(--tx-3);margin-top:2px;}
.xp-badge-big{font-size:32px;font-weight:800;color:var(--primary);background:var(--primary-dim);width:56px;height:56px;border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;}
.skill-row{margin-bottom:var(--s3);}
.skill-row:last-child{margin-bottom:0;}
.skill-row-top{display:flex;align-items:center;justify-content:space-between;}
.skill-pct{font-size:11px;font-weight:600;color:var(--tx-2);}
.today-tasks-list{}
.badges-row{display:flex;gap:var(--s2);flex-wrap:wrap;}
.badge-chip{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border-2);border-radius:var(--r-lg);padding:var(--s2) var(--s4);font-size:12px;font-weight:500;color:var(--tx);}
.badge-chip span:first-child{font-size:18px;}
.quick-actions{display:flex;flex-wrap:wrap;gap:var(--s2);}
</style>`;
}

export function mount(months) {
  // LeetCode quick update
  const btn = document.getElementById('dash-leet-btn');
  if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const n = prompt('Enter your current LeetCode solved count:');
      if (n !== null && !isNaN(parseInt(n))) {
        const { setLeetcodeCount } = await import('../store.js');
        setLeetcodeCount(parseInt(n));
        showToast(`LeetCode count updated: ${n}`, 'terminal');
        const { navigate } = await import('../router.js');
        navigate('dashboard');
      }
    });
  }

  // Today's task toggles
  document.querySelectorAll('.today-task').forEach(row => {
    row.addEventListener('click', async () => {
      const { toggleTask } = await import('../store.js');
      const { checkBadges, showXPFloat } = await import('../gamification.js');
      const id  = row.dataset.id;
      const xpv = parseInt(row.dataset.xp) || 10;
      toggleTask(id, xpv);
      showXPFloat(row, xpv);
      checkBadges(months);
      // Re-render dashboard
      const { navigate } = await import('../router.js');
      navigate('dashboard');
    });
  });
}
