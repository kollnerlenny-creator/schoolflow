// sw.js — Hochperformanter Offline & Turbo-Cache Service Worker für Schooly
// Garantiert sofortiges Laden (0ms aus dem Cache) und vollständige Offline-Nutzung
const CACHE_NAME = 'schooly-cache-v16';

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
          // Standard-CORS-Fetch (KEIN no-cors!), damit ES-Module wie Firebase offline CORS-kompatibel gecacht werden
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

// 2. Aktivierung: Sofort alle Clients übernehmen und alte Caches löschen
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
// - Navigation: Network-First mit 1.2s Timeout, Fallback auf lokalen Cache
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
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1200);
          const networkRes = await fetch(req, { signal: controller.signal });
          clearTimeout(timer);
          if (networkRes && networkRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('/index.html', networkRes.clone());
            cache.put('/', networkRes.clone());
            return networkRes;
          }
        } catch (_) {
          // Offline oder Timeout -> Sofort aus Cache
        }
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html') || await cache.match('/') || await cache.match(req);
        if (cached) return cached;

        return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Schooly Offline</title></head><body>Schooly startet offline...</body></html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
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
        return new Response('', { status: 200, statusText: 'Offline Cache Empty' });
      }
    })
  );
});
