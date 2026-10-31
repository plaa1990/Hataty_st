// Hatafuku Studio Pro - offline service worker (app-sw.js)
const CACHE = 'hatafuku-pro-v1';
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./favicon.svg", "./icon-192.png", "./icon-512.png", "./legacy/hub.html", "./legacy/hatafuku-core.js", "./legacy/hatafuku-palette-app.js", "./assets/index-Bp0_QhT-.css", "./assets/index-_LopRKHk.js"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// stale-while-revalidate สำหรับทุกอย่าง (รวมฟอนต์/ไลบรารีภายนอกที่เคยโหลดแล้ว) -> ใช้ออฟไลน์ได้
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then((r) => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
