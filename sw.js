/* PricePick 프로토타입 PWA service worker
   목적: 설치 가능(beforeinstallprompt) 조건 충족용 최소 SW.
   전략: network-first 패스스루 + 오프라인 시 캐시 폴백(있을 때만). */
const CACHE = 'pricepick-proto-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        try {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        } catch (err) {}
        return res;
      })
      .catch(function () { return caches.match(e.request); })
  );
});
