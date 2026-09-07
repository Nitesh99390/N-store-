/* N-Store Service Worker v2
   Strategy:
   - Pre-cache the app shell (relative paths → works on GitHub Pages sub-path)
   - HTML: network-first with cache fallback (always fresh, works offline)
   - Same-origin assets: stale-while-revalidate
   - Cross-origin (fonts, icons, CDN): cache-first with background refresh
   - Firebase / Google APIs are never intercepted
*/
const VERSION = 'n-store-v2.0.0';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './tictoctoe.html',
  './simon.html',
  './memorygame.html',
  './hello.html',
  './hello1.html',
  './hi.html'
];

const BYPASS_HOSTS = [
  'firebaseio.com',
  'firebasedatabase.app',
  'googleapis.com/identitytoolkit',
  'securetoken.googleapis.com',
  'firebaseapp.com/__/auth',
  'google-analytics.com',
  'googletagmanager.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (BYPASS_HOSTS.some((h) => request.url.includes(h))) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isNavigation = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  const isSameOrigin = url.origin === self.location.origin;

  if (isNavigation) {
    event.respondWith(networkFirst(request));
  } else if (isSameOrigin) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  } else {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request) || await cache.match('./index.html');
    if (cached) return cached;
    return new Response('<h1>Offline</h1><p>N-Store is not available offline yet.</p>', {
      status: 503, headers: { 'Content-Type': 'text/html' }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((res) => {
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    fetch(request).then((res) => { if (res && res.ok) cache.put(request, res.clone()); }).catch(() => {});
    return cached;
  }
  try {
    const res = await fetch(request);
    if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
    return res;
  } catch (err) {
    return new Response('', { status: 504 });
  }
}
