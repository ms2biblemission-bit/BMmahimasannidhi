const CACHE = 'bm-v2';
const FILES = ['index.html','daily.html','quiz.html','gallery.html','archive.html','prayer.html','posts.json','manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => {
    if(k !== CACHE) return caches.delete(k);
  })));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // posts.json - ఎప్పుడూ కొత్తది తెచ్చుకో, లేకపోతే పాతది చూపించు
  if(e.request.url.includes('posts.json')){
    e.respondWith(fetch(e.request).then(res => {
      let copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    let copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  })).catch(() => caches.match('index.html')));
});
