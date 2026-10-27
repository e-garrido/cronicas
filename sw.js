/* Service worker de FacelessStudio: guarda la interfaz y las imágenes para abrir la app al instante.
   Los vídeos no se guardan: iOS necesita peticiones Range y se sirven directos desde GitHub Pages. */
const CACHE = 'facelessstudio-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/apple-touch-icon.png', 'icons/logo.svg'];

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

async function networkFirst(req, fallback) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (fallback ? await cache.match(fallback) : undefined);
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => hit || Response.error());
  return hit || fresh;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range') || /\.(mp4|m4v|mov)$/i.test(url.pathname)) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/data.json') || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(req, req.mode === 'navigate' ? 'index.html' : undefined));
  } else {
    event.respondWith(staleWhileRevalidate(req));
  }
});
