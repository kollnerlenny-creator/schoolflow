/**
 * SchoolFlow – Klausur-Erinnerungen per Firebase Cloud Messaging
 * ------------------------------------------------------------------------
 * Läuft JEDE STUNDE. Für jeden Nutzer wird geprüft, ob die aktuelle Stunde
 * (Europe/Berlin) mit seiner in der App eingestellten Erinnerungs-Uhrzeit
 * übereinstimmt — nur dann wird geprüft, ob eine Klausur/Test im gewählten
 * Erinnerungsfenster liegt, und ein Push verschickt.
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
 * Kosten: 24 Aufrufe/Tag = ~720 Aufrufe/Monat, weit unter dem kostenlosen
 * Kontingent (2 Mio./Monat). Erfordert aber den Blaze-Tarif (siehe Chat).
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Läuft jede volle Stunde (Europe/Berlin) — prüft dann pro Nutzer, ob's "seine" Stunde ist
exports.sendExamReminders = onSchedule(
  { schedule: '0 * * * *', timeZone: 'Europe/Berlin' },
  async () => {
    const nowBerlin = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    const currentHour = nowBerlin.getHours();

    const usersSnap = await db.collection('users').get();
    const today = new Date(nowBerlin); today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const jobs = usersSnap.docs.map(async (userDoc) => {
      const uid = userDoc.id;
      const configRef = db.doc(`users/${uid}/settings/config`);
      const configSnap = await configRef.get();
      const config = configSnap.data();
      if (!config || !config.examRemindersEnabled || !config.fcmToken) return;

      // Eingestellte Uhrzeit (Standard 18:00) — nur bei passender Stunde weitermachen
      const reminderTime = config.examReminderTime || '18:00';
      const reminderHour = parseInt(reminderTime.split(':')[0], 10);
      if (reminderHour !== currentHour) return;

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
            data: { tag: `sf-exam-${t.id}-${todayStr}` },
          }).catch((err) => {
            console.error(`Push an ${uid} fehlgeschlagen (Task ${t.id}):`, err.message);
          })
        );
      });

      await Promise.all(dueSends);
    });

    await Promise.all(jobs);
    console.log(`Klausur-Erinnerungen geprüft für ${usersSnap.size} Nutzer (Stunde ${currentHour}).`);
  }
);
