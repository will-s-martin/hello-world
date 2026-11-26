// App shell is served from cache (works offline, ignores ?query strings, and any
// navigation falls back to the cached page). It's also refreshed in the background,
// so a change shows up on the next launch; bump CACHE only to purge old entries.
const CACHE = 'pomodoro-v2';
const FILES = ['index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const nav = req.mode === 'navigate';
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = nav ? await cache.match('index.html') : await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r.ok) cache.put(nav ? 'index.html' : req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (nav ? cache.match('index.html') : Response.error());
  })());
});
