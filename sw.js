const CACHE_NAME = 'kh-tjc-cache-v1';
const IMAGE_CACHE_NAME = 'kh-tjc-images-v1';

const CORE_PAGES = [
  '/',
  '/style.css',
  '/script.js',
  '/content.js',
  '/admin.html',
  '/admin.css',
  '/admin.js'
];

// ── Install: cache core pages ─────────────────────────────────────────
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_PAGES);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────────────
self.addEventListener('activate', function (event) {
  const validCaches = [CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return !validCaches.includes(name);
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ── Fetch: network-first for everything, cache images separately ────
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // ── Images: cache-first with separate cache ─────────────────────────
  if (
    event.request.destination === 'image' ||
    /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(function (networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function () {
            // If network fails, return a fallback transparent pixel or just the cached version
            return cachedResponse;
          });
        });
      })
    );
    return;
  }

  // ── Core pages: try cache first, fall back to network ──────────────
  // (they were pre-cached on install)
  if (CORE_PAGES.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(function (cachedResponse) {
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

  // ── Everything else: network-first ─────────────────────────────────
  event.respondWith(
    fetch(event.request)
      .then(function (networkResponse) {
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
