const CACHE = 'mahima-v2-clean';
const FILES = ['index.html','manifest.json','posts.json','books.json','IMG-20261104-WA0008.jpg'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{
    if(k!==CACHE) return caches.delete(k);
  })).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  e.respondWith(fetch(e.request).then(r=>{
    let copy=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request, copy));
    return r;
  }).catch(()=>caches.match(e.request)));
});
