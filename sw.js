// sw.js — Hochperformanter Offline & Turbo-Cache Service Worker für Schooly
// Garantiert sofortiges Laden (0ms aus dem Cache) und vollständige Offline-Nutzung
const CACHE_NAME = 'schooly-cache-v17';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/vue.global.prod.js',
  '/lucide.min.js',
  '/tailwindcss.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js',
  '/assets/schooly_logo_transparent.png',
  '/assets/schooly_logo.png',
  '/assets/aistudio/schooly_app_icon_7d45ac62.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. Installation: Sofort aktivieren und wichtige Ressourcen vorab cachen
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of PRECACHE_URLS) {
        try {
          const res = await fetch(url);
          if (res && res.status === 200) {
            await cache.put(url, res);
          }
        } catch (e) {
          console.warn('[SW] Vorab-Cache für', url, 'fehlgeschlagen:', e.message);
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

// 3. Fetch-Strategie:
// - Firebase & Google APIs: Direkt durchleiten (Firestore IndexedDB übernimmt Offline-Sync)
// - Navigation: Network-First mit 5s Timeout, Fallback auf lokalen Cache
// - Statische Ressourcen (JS, CSS, Schriften, Bilder, Icons): Cache-First für 0ms Antwortzeit
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nicht-HTTP Anfragen ignorieren
  if (!url.protocol.startsWith('http')) return;

  // Firebase Firestore/Auth API direkt durchleiten (wird von IndexedDB gehandhabt)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('firebaseinstallations.googleapis.com') ||
    url.hostname.includes('fcmregistrations.googleapis.com') ||
    url.hostname.includes('accounts.google.com')
  ) {
    return;
  }

  // A. HTML-Navigation (App-Shell)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          // Großzügiger 5-Sekunden Timeout für Remote Cloud Run Verbindungen
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 5000);
          const networkRes = await fetch(req, { signal: controller.signal });
          clearTimeout(timer);
          if (networkRes && networkRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('/index.html', networkRes.clone());
            cache.put('/', networkRes.clone());
            return networkRes;
          }
        } catch (_) {
          // Offline oder langsames Netz -> Sofort aus Cache
        }
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html') || await cache.match('/') || await cache.match(req);
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
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(async (cachedRes) => {
      if (cachedRes) {
        return cachedRes;
      }
      try {
        const netRes = await fetch(req);
        if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
          const clone = netRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return netRes;
      } catch (err) {
        // Wenn offline und Ressource nicht gecacht ist
        return new Response('/* Not in offline cache */', { status: 503, statusText: 'Offline unavailable' });
      }
    })
  );
});
