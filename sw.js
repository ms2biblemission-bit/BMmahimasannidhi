// BM Mahima Sannidhi - v2 - old cache clear
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  // index.html ఎప్పుడూ కొత్తదే రావాలి - cache నుండి కాదు
  if (e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      return res;
    }).catch(() => caches.match(e.request))
  );
});
