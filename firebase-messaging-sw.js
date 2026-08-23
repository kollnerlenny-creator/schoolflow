// firebase-messaging-sw.js
// Dieser Service Worker läuft im Hintergrund und zeigt eingehende Push-Benachrichtigungen
// von Firebase Cloud Messaging an — auch wenn SchoolFlow gerade nicht geöffnet ist.
//
// WICHTIG: Diese Datei muss im selben Verzeichnis liegen wie index.html
// (also direkt neben manifest.json, icon-192.png usw.), NICHT in einem Unterordner.

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Muss exakt mit der firebaseConfig in index.html übereinstimmen
firebase.initializeApp({
  apiKey: "AIzaSyDD-CByKnBFcCnHpG94VibtXrjVcmgGj8A",
  authDomain: "gradeflow-637b7.firebaseapp.com",
  projectId: "gradeflow-637b7",
  messagingSenderId: "968757647135", // gleicher Wert wie in index.html
  appId: "1:968757647135:web:512a6e1ebd4e9189a8822a" // gleicher Wert wie in index.html
});

const messaging = firebase.messaging();

// Wird aufgerufen, wenn ein Push ankommt, während die App im Hintergrund/geschlossen ist
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'SchoolFlow';
  const options = {
    body: payload.notification?.body || '',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: payload.data?.tag || 'schoolflow-reminder',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

// Klick auf die Benachrichtigung öffnet die App
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
