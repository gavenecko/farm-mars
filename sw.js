const V='farmmars-v9',F=['./','index.html','manifest.json','favicon.svg','icon-192.png','icon-512.png',...['data','audio','maps','art','game','ui','v5','v6'].map(n=>'js/'+n+'.js?v=9')];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(ca=>ca.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:false}).then(r=>r||caches.match('index.html'))))});
