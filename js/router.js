// js/router.js — Hash-based SPA router

let _routes = {};
let _months = null;

export function initRouter(routes, months) {
  _routes = routes;
  _months = months;

  window._router = { navigate };

  const handleRoute = () => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    _render(hash);
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Initial load
}

export function navigate(hash) {
  if (window.location.hash === `#${hash}`) {
    _render(hash);
  } else {
    window.location.hash = hash;
  }
}

async function _render(hash) {
  const viewModule = _routes[hash] || _routes['dashboard'];
  const appContainer = document.getElementById('app');
  if (!appContainer || !viewModule) return;

  // 1. Highlight Nav
  document.querySelectorAll('.nav-item, .bnav-item').forEach(el => {
    const isActive = el.getAttribute('href') === `#${hash}` || el.dataset.route === hash;
    el.classList.toggle('active', isActive);
  });

  // 2. Transition Out
  appContainer.style.opacity = '0';
  appContainer.style.transform = 'translateY(10px)';
  
  await new Promise(r => setTimeout(r, 150));

  // 3. Render View
  try {
    appContainer.innerHTML = viewModule.render(_months);
    if (viewModule.mount) {
      viewModule.mount(_months);
    }
  } catch (err) {
    console.error('[Router] Error rendering view:', err);
    appContainer.innerHTML = `<div class="card"><h2>Error</h2><p>${err.message}</p></div>`;
  }

  // 4. Transition In
  appContainer.style.opacity = '1';
  appContainer.style.transform = 'translateY(0)';
  
  // Scroll to top
  window.scrollTo(0, 0);
}
