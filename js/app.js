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
  document.documentElement.setAttribute('data-theme', state.theme);

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

// Level Up Celebration
window.addEventListener('store:level-up', (e) => {
  const { level, title } = e.detail;
  import('./gamification.js').then(m => {
    m.launchConfetti();
    window._openModal(`
      <div class="modal text-center" style="padding:var(--s10);">
        <div style="font-size:64px; margin-bottom:var(--s4);">🎉</div>
        <div class="modal-title" style="font-size:28px; margin-bottom:var(--s2);">Level Up!</div>
        <div style="font-size:18px; color:var(--primary); font-weight:800; text-transform:uppercase; letter-spacing:2px; margin-bottom:var(--s6);">
          RANK: ${title}
        </div>
        <p style="color:var(--tx-2); line-height:1.6; margin-bottom:var(--s8);">
          Congratulations Samar! You've reached <b>Level ${level}</b>. Your expertise in AI Engineering is growing.
        </p>
        <button class="btn btn-primary" onclick="window._closeModal()" style="width:100%; justify-content:center;">Continue Journey</button>
      </div>
    `);
  });
});

// Badge Notification
window.addEventListener('store:badge-awarded', (e) => {
  const { badgeId } = e.detail;
  import('./gamification.js').then(m => {
    const badge = m.getBadgeById(badgeId);
    if (badge) {
      m.showToast(`New Badge: ${badge.name}`, badge.icon);
    }
  });
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

// Global Modal System
window._openModal = (html) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  
  // Close on backdrop click
  overlay.addEventListener('click', (e) => { 
    if (e.target === overlay) window._closeModal(); 
  });
  
  // Close on Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      window._closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Focus first input
  setTimeout(() => {
    const firstInput = overlay.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) firstInput.focus();
  }, 100);

  if (window.lucide) window.lucide.createIcons();
};

window._closeModal = () => {
  document.getElementById('active-modal')?.remove();
};
