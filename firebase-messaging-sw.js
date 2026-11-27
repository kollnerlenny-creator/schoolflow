// firebase-messaging-sw.js
// Dieser Service Worker läuft im Hintergrund und zeigt eingehende Push-Benachrichtigungen
// von Firebase Cloud Messaging an — auch auf dem Sperrbildschirm und bei geschlossener App.

importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDD-CByKnBFcCnHpG94VibtXrjVcmgGj8A",
  authDomain: "gradeflow-637b7.firebaseapp.com",
  projectId: "gradeflow-637b7",
  messagingSenderId: "968757647135",
  appId: "1:968757647135:web:512a6e1ebd4e9189a8822a"
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const messaging = firebase.messaging();

// Wird aufgerufen, wenn eine reine Data-Nachricht im Hintergrund ankommt.
// Bei Nachrichten mit `webpush.notification` zeigt der Browser das System-Banner automatisch an.
messaging.onBackgroundMessage((payload) => {
  if (payload?.notification) return;
  const data = payload?.data || {};
  const title = data.title || 'Schooly';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'schooly-reminder',
    data
  };
  return self.registration.showNotification(title, options);
});

// Klick auf die Benachrichtigung fokussiert oder öffnet die App
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.link || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
