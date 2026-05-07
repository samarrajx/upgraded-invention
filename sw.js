const CACHE_NAME = 'ai-eng-os-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  
  './css/tokens.css',
  './css/layout.css',
  './css/components.css',
  './css/animations.css',
  
  './js/app.js',
  './js/data.js',
  './js/store.js',
  './js/gamification.js',
  './js/router.js',
  
  './js/views/dashboard.js',
  './js/views/roadmap.js',
  './js/views/analytics.js',
  './js/views/focus.js',
  './js/views/heatmap.js',
  './js/views/internships.js',
  './js/views/interviews.js',
  './js/views/settings.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Stale-while-revalidate strategy
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          if (e.request.method === 'GET' && e.request.url.startsWith('http')) {
             cache.put(e.request, networkResponse.clone());
          }
        });
        return networkResponse;
      }).catch(() => cached);
      
      return cached || fetchPromise;
    })
  );
});
