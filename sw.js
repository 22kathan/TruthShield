/**
 * TruthShield Service Worker
 * Provides offline capabilities, asset caching, and mobile PWA background lifecycle support.
 */

const CACHE_NAME = 'truthshield-v1.2.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/mobileApp.js',
  './js/imageAnalyzer.js',
  './js/videoAnalyzer.js',
  './js/audioDeepfakeDetector.js',
  './js/transformerEngine.js',
  './js/provenanceDetector.js',
  './js/provenanceSuite.js',
  './js/textAnalyzer.js',
  './js/nlpEngine.js',
  './js/mlCore.js',
  './js/socEngine.js',
  './js/soarPlaybooks.js',
  './js/cryptoVault.js',
  './js/reportGenerator.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/icon.svg'
];

// Install Event — pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[TruthShield SW] Pre-caching core application shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[TruthShield SW] Some assets could not be pre-cached:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup outdated cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[TruthShield SW] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Stale-While-Revalidate with offline fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore chrome-extension or non-HTTP requests
  if (!req.url.startsWith('http')) return;

  // For HTML documents: Network-first, fallback to cache
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match(req);
        })
    );
    return;
  }

  // For static assets (CSS, JS, Images, Icons, Fonts): Cache-first with background revalidation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {/* Offline */});
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, responseToCache));
        return networkResponse;
      }).catch((err) => {
        console.warn('[TruthShield SW] Resource fetch failed:', req.url);
      });
    })
  );
});
