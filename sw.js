// sw.js — Hochperformanter Offline Service Worker für Schooly
// Ermöglicht komplette Offline-Nutzung: App-Shell, Schriften, Icons, Logik & Styles
const CACHE_NAME = 'schooly-offline-v2';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/aistudio/schooly_app_icon_7d45ac62.svg',
  'https://fonts.googleapis.com/css2?family=Epilogue:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js'
];

// 1. Installation: App-Shell vorladen
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Fehlertolerantes Cachen aller Shell-Dateien
      return Promise.allSettled(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { mode: 'cors' })).catch((err) => {
            console.warn('[SW] Vorab-Cache für Ressource übersprungen:', url, err);
          })
        )
      );
    })
  );
});

// 2. Aktivierung: Alte Cache-Versionen bereinigen & Clients sofort übernehmen
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
// - Firebase Cloud Firestore/Auth API-Anfragen NICHT abfangen (das übernimmt das Firestore IndexedDB SDK direkt)
// - HTML-Navigation: Network-First mit sofortigem Fallback auf gecachte index.html
// - Assets (Scripts, Styles, Fonts, Icons): Stale-While-Revalidate / Cache-First
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nur HTTP/HTTPS Anfragen bearbeiten
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

  // A. Navigation (HTML Hauptseite)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline-Fallback: Gecachtes index.html zurückgeben
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response('Schooly ist offline bereit.', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // B. Statische Ressourcen (JS, CSS, Fonts, Bilder, SVG)
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      // Wenn im Cache: sofort zurückgeben und im Hintergrund aktualisieren
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => cachedRes); // Bei Netzwerkfehler Cache nutzen

      return cachedRes || fetchPromise;
    })
  );
});
