const CACHE = 'bm-v3';
const CORE_FILES = ['index.html','daily.html','quiz.html','gallery.html','archive.html','prayer.html','bible.html','books.html','songs.html','voice.html','videos.html','posts.json','manifest.json'];
const OPTIONAL_FILES = ['bible.json','books.json','songs.json','videos.json','voice.json','gallery.json','jesus.jpg','devadasu.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      // ముఖ్యమైన ఫైల్స్ - ఒకటి లేకపోయినా ఆగకూడదు
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
  // JSON ఫైల్స్ - ఎప్పుడూ కొత్తది తెచ్చుకో, నెట్ లేకపోతే పాతది చూపించు - బైబిల్ / బుక్స్ / పాటలు / వాక్యం
  if(url.includes('.json')){
    e.respondWith(fetch(e.request).then(res => {
      // 200 వస్తేనే సేవ్ చేయి
      if(res && res.status===200){
        let copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  // HTML / ఫోటోలు - ముందు కాష్ లో చూడు, లేకపోతే నెట్ నుండి తెచ్చి సేవ్ చేయి
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if(res && res.status===200){
      let copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  })).catch(() => {
    // నెట్ లేదు + కాష్ లో లేదు - హోమ్ చూపించు
    if(e.request.destination === 'document') return caches.match('index.html');
    return caches.match(e.request);
  }));
});
