const CACHE = 'bm-v5';
const CORE_FILES = ['index.html','kids.html','daily.html','quiz.html','gallery.html','archive.html','prayer.html','bible.html','books.html','songs.html','voice.html','videos.html','posts.json','manifest.json','icon-192.png','icon-512.png'];
const OPTIONAL_FILES = ['bible.json','books.json','songs.json','videos.json','voice.json','gallery.json','jesus.jpg','devadasu.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      for(let f of CORE_FILES){
        try{ await c.add(f); }catch(err){}
      }
      for(let f of OPTIONAL_FILES){
        try{ await c.add(f); }catch(err){}
      }
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => {
    if(k !== CACHE) return caches.delete(k);
  })));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  let url = e.request.url;
  if(url.includes('.json')){
    e.respondWith(fetch(e.request).then(res => {
      if(res && res.status===200){
        let copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  if(e.request.destination === 'document'){
    e.respondWith(fetch(e.request).then(res => {
      if(res && res.status===200){
        let copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if(res && res.status===200){
      let copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  })).catch(() => caches.match(e.request)));
});
