const CACHE='nexo-fit-v7';
const CORE=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nexo-fit-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;const u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==location.origin)return;
 if(req.mode==='navigate'||u.pathname.endsWith('/index.html')){
  event.respondWith(fetch(req).then(resp=>{if(resp&&resp.ok)caches.open(CACHE).then(c=>c.put('./index.html',resp.clone()));return resp;}).catch(()=>caches.match('./index.html')));return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{if(resp&&resp.ok)caches.open(CACHE).then(c=>c.put(req,resp.clone()));return resp;}).catch(()=>caches.match('./index.html'))));
});
