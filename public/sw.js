const CACHE_VERSION = "rp-v1";
const APP_SHELL = [
  "/RunPayway/",
  "/RunPayway/diagnostic-portal/",
  "/RunPayway/diagnostic/",
  "/RunPayway/free-score/",
  "/RunPayway/dashboard/",
  "/RunPayway/review/",
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // Individual page failures shouldn't block install
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: strategy based on request type
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache worker API calls
  if (url.hostname.includes("mcallpl.workers.dev")) return;

  // Never cache Stripe, analytics, or external APIs
  if (url.hostname !== location.hostname) return;

  // Hashed assets (JS/CSS): cache-first (immutable)
  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // HTML pages: stale-while-revalidate
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          return response;
        }).catch(() => cached); // If network fails, use cache
        return cached || fetchPromise;
      })
    );
    return;
  }
});
