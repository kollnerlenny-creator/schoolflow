// sw.js — Hochperformanter Offline & Turbo-Cache Service Worker für Schooly
// Garantiert sofortiges Laden (0ms aus dem Cache) und vollständige Offline-Nutzung
const CACHE_NAME = 'schooly-turbo-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/schooly_logo_transparent.png',
  '/assets/schooly_logo.png',
  '/assets/aistudio/schooly_app_icon_7d45ac62.svg',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js',
  'https://fonts.googleapis.com/css2?family=Epilogue:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap'
];

// 1. Installation: Sofort aktivieren und wichtige Ressourcen vorab cachen
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Fehlertolerantes Vorladen jeder einzelnen Ressource
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            const req = new Request(url, { mode: 'no-cors' });
            const res = await fetch(req);
            if (res) await cache.put(url, res);
          } catch (e) {
            console.warn('[SW] Vorab-Cache für', url, 'fehlgeschlagen:', e.message);
          }
        })
      );
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
// - Firebase & Google APIs: Direkt durchleiten (Firestore IndexedDB übernimmt Offline-Sync selbst)
// - HTML/Navigation: Cache-First mit Hintergrund-Revalidierung (sofortiges Laden ohne Wartezeit)
// - Assets (JS, CSS, Schriften, Bilder, Icons): Cache-First mit dynamischem Caching
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nicht-HTTP Anfragen ignorieren
  if (!url.protocol.startsWith('http')) return;

  // Firebase/Google Auth/Firestore API Anfragen direkt an den Browser / Firebase SDK übergeben
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
      caches.open(CACHE_NAME).then(async (cache) => {
        // Erst im Cache nach index.html oder / suchen
        const cachedHtml = await cache.match('/index.html') 
          || await cache.match('/') 
          || await cache.match(req);

        // Im Hintergrund frische Version aus dem Netzwerk holen wenn online
        const networkFetch = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const clone = networkRes.clone();
              cache.put('/index.html', clone);
              cache.put('/', networkRes.clone());
            }
            return networkRes;
          })
          .catch(() => null);

        // Wenn gecachte Version vorhanden: SOFORT ausliefern (0ms Ladezeit!)
        if (cachedHtml) {
          return cachedHtml;
        }

        // Falls noch nicht im Cache: Auf Netzwerk warten
        const netRes = await networkFetch;
        if (netRes) return netRes;

        // Ultrakompakter Notfall-Fallback
        return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Schooly Offline</title></head><body>Schooly startet offline...</body></html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
    return;
  }

  // B. Statische Ressourcen (JS, CSS, Schriften, Bilder, Icons)
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(async (cachedRes) => {
      if (cachedRes) {
        // 0ms Antwortzeit aus dem Cache
        return cachedRes;
      }

      // Wenn noch nicht im Cache: aus dem Netzwerk laden & dynamisch speichern
      try {
        const networkRes = await fetch(req);
        if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return networkRes;
      } catch (err) {
        // Bei komplettem Offline-Modus: Kein Abbruch, sondern leere Antwort
        return new Response('', { status: 200, statusText: 'Offline Cache Empty' });
      }
    })
  );
});
