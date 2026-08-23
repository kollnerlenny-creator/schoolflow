/**
 * SchoolFlow – tägliche Klausur-Erinnerungen per Firebase Cloud Messaging
 * ------------------------------------------------------------------------
 * Diese Datei ist der Server-Teil (Cloud Function), der einmal täglich läuft,
 * für jeden Nutzer prüft ob eine Klausur/Test im gewählten Erinnerungsfenster
 * liegt, und dafür einen Push an sein gespeichertes FCM-Token schickt.
 *
 * DEPLOYMENT (in deinem Projektordner, einmalig einrichten):
 *   1. npm install -g firebase-tools          (falls noch nicht installiert)
 *   2. firebase login
 *   3. firebase init functions                (im Projekt-Root, dort wo diese
 *      functions/ -Datei liegen soll — wähle dein bestehendes Firebase-Projekt
 *      "gradeflow-637b7", Sprache: JavaScript)
 *   4. Diese Datei ersetzt/ergänzt die generierte functions/index.js
 *   5. cd functions && npm install firebase-admin firebase-functions
 *   6. Zurück im Projekt-Root: firebase deploy --only functions
 *
 * Kosten: 1 Aufruf/Tag = ~30 Aufrufe/Monat, weit unter dem kostenlosen
 * Kontingent (2 Mio./Monat). Erfordert aber den Blaze-Tarif (siehe Chat).
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Läuft jeden Tag um 18:00 Uhr (Europe/Berlin) — Zeit hier nach Wunsch anpassen
exports.sendExamReminders = onSchedule(
  { schedule: '0 18 * * *', timeZone: 'Europe/Berlin' },
  async () => {
    const usersSnap = await db.collection('users').get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jobs = usersSnap.docs.map(async (userDoc) => {
      const uid = userDoc.id;
      const configSnap = await db.doc(`users/${uid}/settings/config`).get();
      const config = configSnap.data();
      if (!config || !config.examRemindersEnabled || !config.fcmToken) return;

      const reminderDays = typeof config.examReminderDays === 'number' ? config.examReminderDays : 1;

      const [tasksSnap, subjectsSnap] = await Promise.all([
        db.collection(`users/${uid}/tasks`).get(),
        db.collection(`users/${uid}/subjects`).get(),
      ]);
      const subjectsById = {};
      subjectsSnap.docs.forEach((s) => { subjectsById[s.id] = s.data(); });

      const dueSends = [];
      tasksSnap.docs.forEach((t) => {
        const task = t.data();
        if (task.done) return;
        if (task.type !== 'Klausur' && task.type !== 'Test') return;
        const taskDate = new Date(task.date + 'T00:00:00');
        const daysUntil = Math.round((taskDate - today) / 86400000);
        if (daysUntil < 0 || daysUntil > reminderDays) return;

        const subject = subjectsById[task.subjectId];
        const dayLabel = daysUntil === 0 ? 'heute' : daysUntil === 1 ? 'morgen' : `in ${daysUntil} Tagen`;

        dueSends.push(
          messaging.send({
            token: config.fcmToken,
            notification: {
              title: `${task.type}: ${subject?.name || ''}`,
              body: `${task.title} — ${dayLabel}`,
            },
            data: { tag: `sf-exam-${t.id}` },
          }).catch((err) => {
            console.error(`Push an ${uid} fehlgeschlagen (Task ${t.id}):`, err.message);
          })
        );
      });

      await Promise.all(dueSends);
    });

    await Promise.all(jobs);
    console.log(`Klausur-Erinnerungen geprüft für ${usersSnap.size} Nutzer.`);
  }
);
