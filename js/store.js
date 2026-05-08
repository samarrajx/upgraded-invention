// js/store.js — Unified state management

const KEY = 'career_os_v2';
const OLD_KEY = 'samar_roadmap_v1';

const DEFAULT_STATE = {
  checked: {},       // { taskId: true }
  dailyLog: {},      // { 'YYYY-MM-DD': [taskId, ...] }
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  badges: [],        // ['badge_id', ...]
  internships: [],
  interviews: [],
  leetcodeCount: 0,
  leetcodeLog: [],   // [{ date, count, note }]
  notes: {},         // { taskId: 'note text' }
  theme: 'dark',
  xpHistory: [],     // [{ week: 'YYYY-Www', xp: N }]
  weeklyLog: {},     // { 'YYYY-Www': N } task count per week
  version: 2,
  dailyGoal: 3
};

let _state = null;

function _load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    // Migrate from old key
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const oldChecked = JSON.parse(old);
      console.log('[Store] Migrating from old key, tasks:', Object.keys(oldChecked).length);
      return { ...DEFAULT_STATE, checked: oldChecked };
    }
  } catch (e) { console.warn('[Store] Load error:', e); }
  return { ...DEFAULT_STATE };
}

function _save() {
  try { localStorage.setItem(KEY, JSON.stringify(_state)); }
  catch (e) { console.warn('[Store] Save error:', e); }
}

function _emit(event, detail = {}) {
  window.dispatchEvent(new CustomEvent('store:' + event, { detail }));
}

export function initStore() {
  _state = _load();
  _checkStreak();
  return _state;
}

export function getState() { return _state; }

// ── Task toggle ──
export function toggleTask(taskId, xpValue = 10) {
  const wasChecked = !!_state.checked[taskId];
  _state.checked[taskId] = !wasChecked;

  const today = _today();
  if (!_state.dailyLog[today]) _state.dailyLog[today] = [];

  if (!wasChecked) {
    // Completing
    _state.xp += xpValue;
    if (!_state.dailyLog[today].includes(taskId))
      _state.dailyLog[today].push(taskId);
    _updateWeeklyLog(today);
    _checkLevelUp();
    _updateStreak(today);
    _emit('task-complete', { taskId, xp: xpValue, totalXP: _state.xp });
  } else {
    // Unchecking
    _state.xp = Math.max(0, _state.xp - xpValue);
    _state.dailyLog[today] = (_state.dailyLog[today] || []).filter(id => id !== taskId);
    _emit('task-uncomplete', { taskId });
  }

  _save();
  _emit('change', { taskId });
}

// ── Streak ──
function _today() { return new Date().toISOString().split('T')[0]; }

function _yesterday() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function _checkStreak() {
  const today = _today();
  const last = _state.lastActiveDate;
  if (!last) return;
  if (last === today) return; // already active today
  if (last === _yesterday()) return; // streak intact, just not checked in today yet
  // Missed a day - reset streak
  _state.streak = 0;
  _save();
}

function _updateStreak(today) {
  const last = _state.lastActiveDate;
  if (last === today) return;
  if (last === _yesterday()) {
    _state.streak += 1;
  } else if (!last) {
    _state.streak = 1;
  } else {
    _state.streak = 1; // broken, restart
  }
  _state.lastActiveDate = today;
  if (_state.streak > _state.longestStreak)
    _state.longestStreak = _state.streak;
}

// ── Level system ──
const LEVELS = [
  { level:1,  xp:0,    title:'Novice' },
  { level:2,  xp:200,  title:'Apprentice' },
  { level:3,  xp:600,  title:'Builder' },
  { level:4,  xp:1400, title:'Engineer' },
  { level:5,  xp:3000, title:'Architect' },
  { level:6,  xp:6000, title:'Master' },
  { level:7,  xp:10000,title:'Legend' },
];

function _checkLevelUp() {
  const newLevel = _getCurrentLevel();
  if (newLevel.level > _state.level) {
    _state.level = newLevel.level;
    _emit('level-up', { level: newLevel.level, title: newLevel.title });
  }
}

function _getCurrentLevel() {
  let cur = LEVELS[0];
  for (const l of LEVELS) { if (_state.xp >= l.xp) cur = l; }
  return cur;
}

export function getLevelInfo() {
  const cur = _getCurrentLevel();
  const idx = LEVELS.indexOf(cur);
  const next = LEVELS[idx + 1] || null;
  const pct = next
    ? Math.min(100, Math.round((_state.xp - cur.xp) / (next.xp - cur.xp) * 100))
    : 100;
  return { ...cur, nextXP: next?.xp ?? null, pct };
}

export { LEVELS };

// ── Weekly log ──
function _weekKey(dateStr) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2,'0')}`;
}

function _updateWeeklyLog(today) {
  const wk = _weekKey(today);
  _state.weeklyLog[wk] = (_state.weeklyLog[wk] || 0) + 1;
}

export function getWeeklyData(weeks = 12) {
  const result = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i * 7);
    const key = _weekKey(d.toISOString().split('T')[0]);
    result.push({ key, count: _state.weeklyLog[key] || 0, date: d });
  }
  return result;
}

export function getDailyLog() { return _state.dailyLog; }

// ── Internships ──
export function addInternship(data) {
  const entry = { id: Date.now(), ...data, createdAt: _today() };
  _state.internships.push(entry);
  _save(); _emit('change');
  return entry;
}
export function updateInternship(id, data) {
  const idx = _state.internships.findIndex(x => x.id === id);
  if (idx > -1) { _state.internships[idx] = { ..._state.internships[idx], ...data }; _save(); _emit('change'); }
}
export function deleteInternship(id) {
  _state.internships = _state.internships.filter(x => x.id !== id);
  _save(); _emit('change');
}

// ── Interview log ──
export function addInterview(data) {
  const entry = { id: Date.now(), ...data, date: _today() };
  _state.interviews.push(entry);
  _save(); _emit('change');
  return entry;
}
export function deleteInterview(id) {
  _state.interviews = _state.interviews.filter(x => x.id !== id);
  _save(); _emit('change');
}

// ── LeetCode ──
export function setLeetcodeCount(n, note = '') {
  const delta = n - (_state.leetcodeCount || 0);
  _state.leetcodeCount = n;
  _state.leetcodeLog.push({ 
    date: _today(), 
    count: n, 
    delta,
    note: note || '' 
  });
  _save(); _emit('change');
}

// ── Notes ──
export function setNote(taskId, text) {
  _state.notes[taskId] = text;
  _save(); _emit('change');
}
export function getNote(taskId) {
  return _state.notes[taskId] || '';
}

// ── Daily Goal ──
export function setDailyGoal(n) {
  _state.dailyGoal = n;
  _save(); _emit('change');
}
export function getDailyGoal() {
  return _state.dailyGoal || 3;
}

// ── Theme ──
export function setTheme(t) {
  _state.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  _save();
}

// ── Badges ──
export function awardBadge(id) {
  if (_state.badges.includes(id)) return false;
  _state.badges.push(id);
  _save();
  _emit('badge', { id });
  return true;
}

// ── Export / Import ──
export function exportData() {
  const blob = new Blob([JSON.stringify(_state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `career-os-backup-${_today()}.json`;
  a.click();
}

export function importData(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    _state = { ...DEFAULT_STATE, ...parsed };
    _save();
    _emit('change');
    return true;
  } catch { return false; }
}

// ── Reset ──
export function resetAll() {
  _state = { ...DEFAULT_STATE };
  _save();
  _emit('change');
}

// ── Computed helpers ──
export function getProgressStats(months) {
  const total = months.reduce((a, m) => a + m.weeks.reduce((b, w) => b + w.tasks.length, 0), 0);
  const done = Object.values(_state.checked).filter(Boolean).length;
  return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
}

export function getSkillStats(months) {
  const skills = {};
  months.forEach(m => m.weeks.forEach((w, wi) => {
    if (!skills[w.skill]) skills[w.skill] = { total: 0, done: 0 };
    w.tasks.forEach((_, ti) => {
      const id = `${m.id}_w${wi}_t${ti}`;
      skills[w.skill].total++;
      if (_state.checked[id]) skills[w.skill].done++;
    });
  }));
  return skills;
}

export function getTodayCount() {
  return (_state.dailyLog[_today()] || []).length;
}

// ── Analytics Helpers ──
export function getBurndownData(months) {
  const totalTasks = months.reduce((sum, m) =>
    sum + m.weeks.reduce((s2, w) => s2 + w.tasks.length, 0), 0);
  const totalDays = 36 * 30; // 3-year roadmap approximate days
  const startDate = new Date('2025-01-01'); // Roadmap start
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / 86400000);

  const expectedDone = Math.min(totalTasks, Math.round((daysPassed / totalDays) * totalTasks));
  const actualDone = Object.values(_state.checked).filter(Boolean).length;

  return { totalTasks, expectedDone, actualDone, daysPassed, totalDays };
}

export function getMonthlyVelocity(months) {
  const s = _state;
  return months.map(m => {
    let done = 0, total = 0;
    m.weeks.forEach((w, wi) => w.tasks.forEach((_, ti) => {
      total++;
      if (s.checked[`${m.id}_w${wi}_t${ti}`]) done++;
    }));
    return { label: m.badge, done, total, pct: total ? Math.round(done/total*100) : 0 };
  });
}
