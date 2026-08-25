// sw.js — einfacher Service Worker für SchoolFlow.
// Sorgt dafür, dass die App als PWA installierbar ist und im Offline-Fall
// nicht komplett weiß bleibt. Muss im selben Verzeichnis wie index.html liegen.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('Offline – bitte Internetverbindung prüfen.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }))
    );
  }
});
