import { initStore, getState } from './store.js';
import { ROADMAP_DATA } from './data.js';
import { initRouter } from './router.js';

// Views
import * as DashboardView from './views/dashboard.js';
import * as RoadmapView from './views/roadmap.js';
import * as AnalyticsView from './views/analytics.js';
import * as FocusView from './views/focus.js';
import * as HeatmapView from './views/heatmap.js';
import * as InternshipsView from './views/internships.js';
import * as InterviewsView from './views/interviews.js';
import * as SettingsView from './views/settings.js';

const routes = {
  'dashboard': DashboardView,
  'roadmap': RoadmapView,
  'analytics': AnalyticsView,
  'focus': FocusView,
  'heatmap': HeatmapView,
  'internships': InternshipsView,
  'interviews': InterviewsView,
  'settings': SettingsView
};

function init() {
  // 1. Initialize State
  initStore();
  const state = getState();

  // 2. Set Theme
  document.body.className = `theme-${state.theme}`;

  // 3. Initialize Router
  initRouter(routes, ROADMAP_DATA);

  // 4. Update Header Profile
  updateHeader(state);

  // 5. Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('SW Registration Failed', err));
  }
}

function updateHeader(state) {
  const lvlEls = document.querySelectorAll('#hdr-lvl, #sidebar-lvl');
  const xpEls = document.querySelectorAll('#hdr-xp, #sidebar-xp');
  lvlEls.forEach(el => el.textContent = state.level);
  xpEls.forEach(el => el.textContent = state.xp.toLocaleString());
}

// Global update hook
['store:change', 'store:task-complete', 'store:task-uncomplete'].forEach(ev => {
  window.addEventListener(ev, () => updateHeader(getState()));
});

// PWA Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Notify views that install is available
  window.dispatchEvent(new CustomEvent('pwa:install-available'));
});

window._getPwaPrompt = () => deferredPrompt;
window._clearPwaPrompt = () => { deferredPrompt = null; };

document.addEventListener('DOMContentLoaded', init);
