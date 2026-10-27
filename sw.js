/* Service worker: guarda la interfaz y los pósters para abrir la app al instante.
   Los vídeos NO se guardan: iOS necesita peticiones Range y se sirven directos desde GitHub Pages. */
const CACHE = 'cronicas-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return hit || (await fresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.destination === 'video' || req.destination === 'audio' || req.headers.has('range')) return;

  if (url.pathname.endsWith('/data.json')) {
    event.respondWith(networkFirst(req));
  } else if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req).catch(() => caches.match('index.html')));
  } else {
    event.respondWith(staleWhileRevalidate(req));
  }
});
