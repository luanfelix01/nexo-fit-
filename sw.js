const CACHE='nexo-fit-v6';
const CORE=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 const u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==location.origin)return;
 // HTML e arquivos principais: tenta rede primeiro para não prender o usuário numa versão antiga.
 const isMain=req.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/sw.js')||u.pathname.endsWith('/manifest.webmanifest');
 if(isMain){
  event.respondWith(fetch(req,{cache:'no-store'}).then(resp=>{
   if(resp&&resp.ok&&u.pathname.endsWith('/index.html')) caches.open(CACHE).then(c=>c.put('./index.html',resp.clone()));
   return resp;
  }).catch(()=>caches.match(req).then(cached=>cached||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{
  if(resp&&resp.ok)caches.open(CACHE).then(c=>c.put(req,resp.clone()));
  return resp;
 }).catch(()=>caches.match('./index.html'))));
});
