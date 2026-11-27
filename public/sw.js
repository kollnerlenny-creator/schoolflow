// sw.js — Hochperformanter Offline & Turbo-Cache Service Worker für Schooly
// Garantiert sofortiges Laden, aktuelle App-Shell und vollständige Offline-Nutzung
const CACHE_NAME = 'schooly-cache-v65';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/vue.global.prod.js',
  '/lucide.min.js',
  '/tailwindcss.js',
  '/src/sync-engine.js',
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging.js',
  '/assets/schooly_logo_transparent.png',
  '/assets/schooly_logo.png',
  '/assets/aistudio/schooly_app_icon_7d45ac62.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png'
];

// 1. Installation: Sofort aktivieren, App-Shell + gebündelte /assets/*.js sofort vorab cachen
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const discoveredAssetUrls = new Set();
      for (const url of PRECACHE_URLS) {
        try {
          const isSameOrigin = url.startsWith('/');
          const res = await fetch(url, isSameOrigin ? { cache: 'no-store' } : { mode: 'cors' });
          if (res && res.status === 200) {
            if (url === '/index.html') {
              try {
                const htmlText = await res.clone().text();
                const assetMatches = htmlText.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css)|\/src\/sync-engine\.js)"/g);
                for (const m of assetMatches) {
                  if (m && m[1]) discoveredAssetUrls.add(m[1]);
                }
              } catch (_) {}
            }
            await cache.put(url, res);
          }
        } catch (e) {
          console.warn('[SW] Vorab-Cache für', url, 'fehlgeschlagen:', e.message);
        }
      }
      for (const assetUrl of discoveredAssetUrls) {
        try {
          const assetRes = await fetch(assetUrl, { cache: 'no-store' });
          if (assetRes && assetRes.status === 200) {
            await cache.put(assetUrl, assetRes);
          }
        } catch (e) {
          console.warn('[SW] Bundle-Cache für', assetUrl, 'fehlgeschlagen:', e.message);
        }
      }
    })
  );
});

// 2. Aktivierung: Sofort alle Clients übernehmen und alte Caches restlos löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Alten Cache gelöscht:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 3. Fetch-Strategie:
// - Firebase & Google APIs: Direkt durchleiten (Outbox + Firestore handhaben Offline-Sync)
// - Navigation & /src/sync-engine.js: Network-First mit kurzem Timeout (vermeidet Versionskonflikte & Hänger)
// - Statische Ressourcen & Module: Stale-While-Revalidate (sofortiger Start + stille Aktualisierung)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nicht-HTTP oder Nicht-GET Anfragen ignorieren
  if (!url.protocol.startsWith('http') || req.method !== 'GET') return;

  // Firebase Firestore/Auth/Google APIs direkt durchleiten
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('firebaseinstallations.googleapis.com') ||
    url.hostname.includes('fcmregistrations.googleapis.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('accounts.google.com')
  ) {
    return;
  }

  // Landing, Pitchdeck, Social-Studio, API- & Vite-Dev-Interna (außer /src/sync-engine.js) niemals durch SW abfangen/cachen
  const isSyncEngineSrc = url.pathname === '/src/sync-engine.js';
  if (
    url.pathname.startsWith('/landing') ||
    url.pathname.startsWith('/pitchdeck') ||
    url.pathname.startsWith('/social') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/@') ||
    (url.pathname.startsWith('/src/') && !isSyncEngineSrc) ||
    url.search.includes('html-proxy') ||
    url.search.includes('t=') ||
    url.pathname.includes('node_modules')
  ) {
    return;
  }

  // A0. /src/sync-engine.js immer Network-First laden, damit index.html & sync-engine immer zusammenpassen
  if (isSyncEngineSrc) {
    event.respondWith(
      (async () => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3500);
          const networkRes = await fetch('/src/sync-engine.js', {
            cache: 'no-store',
            credentials: 'same-origin',
            signal: controller.signal
          });
          clearTimeout(timer);
          if (networkRes && networkRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put('/src/sync-engine.js', networkRes.clone());
            return networkRes;
          }
        } catch (_) {}
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/src/sync-engine.js') || await cache.match(req);
        if (cached) return cached;
        return fetch(req);
      })()
    );
    return;
  }

  // A. HTML-Navigation (App-Shell)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          // Sauberen URL-Fetch statt fetch(navigateReq, init) verwenden (verhindert TypeError auf iOS Safari & Standalone-PWA)
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4500);
          const fetchTarget = (url.pathname === '/' || url.pathname === '/index.html')
            ? '/index.html'
            : (url.pathname + url.search);
          const networkRes = await fetch(fetchTarget, {
            cache: 'no-store',
            credentials: 'same-origin',
            signal: controller.signal
          });
          clearTimeout(timer);
          if (networkRes && networkRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            if (url.pathname === '/' || url.pathname === '/index.html') {
              await cache.put('/index.html', networkRes.clone());
              await cache.put('/', networkRes.clone());
            } else {
              await cache.put(url.pathname + url.search, networkRes.clone());
            }
            return networkRes;
          }
        } catch (_) {
          // Offline oder Timeout -> Fallback auf lokalen Cache
        }

        const cache = await caches.open(CACHE_NAME);
        const isRoot = url.pathname === '/' || url.pathname === '/index.html';
        const cached = isRoot
          ? (await cache.match('/index.html') || await cache.match('/'))
          : (await cache.match(req) || await cache.match(url.pathname));
        if (cached) return cached;

        try {
          return await fetch(req);
        } catch (_) {
          return new Response(
            '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Schooly Offline</title><style>body{background:#f7f3eb;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#2d694c;text-align:center;padding:24px;box-sizing:border-box;}button{background:#2d694c;color:white;border:none;padding:12px 24px;border-radius:999px;font-weight:bold;cursor:pointer;margin-top:16px;box-shadow:0 4px 12px rgba(45,105,76,0.25);}</style></head><body><div><h2 style="font-size:22px;margin-bottom:8px;">Schooly Offline-Start</h2><p style="color:#524d44;font-size:14px;">Bitte kurz mit dem Internet verbinden, um die App vollständig zu synchronisieren.</p><button onclick="location.reload()">App neu laden</button></div></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // B. Statische & geladene Ressourcen (JS, CSS, Schriften, Bilder, Icons)
  const isSameOrigin = url.origin === self.location.origin;
  const isCorsRequest = req.mode === 'cors';
  event.respondWith(
    caches.match(req).then(async (exactRes) => {
      let cachedRes = exactRes || (!url.search.includes('html-proxy') ? await caches.match(req, { ignoreSearch: true }) : null);
      if (cachedRes && isCorsRequest && cachedRes.type === 'opaque') {
        cachedRes = null;
      }
      const fetchAndUpdate = fetch(req, isSameOrigin ? { cache: 'no-store' } : undefined).then((netRes) => {
        const allowOpaque = !isCorsRequest && netRes.type === 'opaque';
        if (netRes && (netRes.status === 200 || allowOpaque)) {
          const clone = netRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return netRes;
      });
      if (cachedRes) {
        if (isSameOrigin) {
          event.waitUntil(fetchAndUpdate.catch(() => {}));
        }
        return cachedRes;
      }
      try {
        return await fetchAndUpdate;
      } catch (err) {
        return new Response('/* Not in offline cache */', { status: 503, statusText: 'Offline unavailable' });
      }
    })
  );
});

// 4. Background Sync: Sobald Chrome/Android nach Offline-Phase wieder Netz hat, offene Clients zum Outbox-Flush anstoßen
self.addEventListener('sync', (event) => {
  if (event.tag === 'schooly-sync-pending') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
          client.postMessage({ type: 'SCHOOLY_TRIGGER_SYNC' });
        }
      }).catch(() => {})
    );
  }
});
