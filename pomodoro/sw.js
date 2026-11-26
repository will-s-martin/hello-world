// App shell is served from cache (works offline, ignores ?query strings, and launching the app
// at ./ or ./index.html falls back to the cached page). It's refreshed in the background, so a
// change shows up on the next launch; bump CACHE only to purge old entries.
const CACHE = 'pomodoro-v3';
const FILES = ['index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const BASE = new URL('./', self.registration.scope).pathname;           // e.g. /pomodoro/
const isShell = path => path === BASE || path === BASE.slice(0, -1) || path === BASE + 'index.html';

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Only a page load of the app itself maps to the cached shell. Opening any other file
  // (the icon, the manifest) is served as that file and can never overwrite the shell.
  const shell = req.mode === 'navigate' && isShell(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = shell ? await cache.match('index.html') : await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => {
      const html = (r.headers.get('content-type') || '').includes('text/html');
      if (r.ok && (!shell || html)) cache.put(shell ? 'index.html' : req, r.clone());
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || Response.error();
  })());
});
