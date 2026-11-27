import crypto from 'node:crypto';
import {
  hasServiceAccountEnv,
  parseServiceAccount,
  getGoogleAccessToken,
  firestoreGetDoc,
  firestoreListCollection,
  firestorePatchFields,
  extractTokensFromConfig,
  sendPushToUserConfig,
} from './_fcm.js';

function timingSafeMatch(provided, expected) {
  if (!provided || !expected) return false;
  const bufA = Buffer.from(String(provided), 'utf8');
  const bufB = Buffer.from(String(expected), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getBerlinNowParts() {
  const now = new Date();
  const dateFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hourFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    hour12: false,
  });
  const todayStr = dateFmt.format(now); // YYYY-MM-DD
  const currentHour = Number(hourFmt.format(now)) % 24;
  return { todayStr, currentHour };
}

function diffDaysYmd(targetYmd, baseYmd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(targetYmd || ''))) return NaN;
  const t = new Date(`${targetYmd}T00:00:00Z`);
  const b = new Date(`${baseYmd}T00:00:00Z`);
  return Math.round((t.getTime() - b.getTime()) / 86400000);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (!cronSecret) {
    return res.status(503).json({
      error: 'CRON_SECRET_NOT_CONFIGURED',
      message: 'Bitte CRON_SECRET in den Server-Umgebungsvariablen hinterlegen.',
    });
  }

  const authHeader = String(req.headers?.authorization || '');
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const headerSecret = String(req.headers?.['x-cron-secret'] || '').trim();
  const providedSecret = bearerToken || headerSecret;

  if (!timingSafeMatch(providedSecret, cronSecret)) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const sa = parseServiceAccount();
  if (!sa) {
    if (hasServiceAccountEnv()) {
      return res.status(503).json({
        error: 'FIREBASE_SERVICE_ACCOUNT_INVALID',
        message: 'FIREBASE_SERVICE_ACCOUNT_JSON ist gesetzt, aber kein gültiges Firebase-Dienstkonto-JSON.',
      });
    }
    return res.status(503).json({
      error: 'FIREBASE_SERVICE_ACCOUNT_MISSING',
      message: 'Bitte FIREBASE_SERVICE_ACCOUNT_JSON in den Server-Umgebungsvariablen hinterlegen.',
    });
  }

  const forceAllHours = String(req.query?.force || '').trim() === '1';

  try {
    const accessToken = await getGoogleAccessToken(sa);
    const projectId = sa.project_id;
    const { todayStr, currentHour } = getBerlinNowParts();

    // Collect candidate user IDs from publicProfiles + users (incl. virtual parent docs)
    const [profilesDocs, usersDocs] = await Promise.all([
      firestoreListCollection(projectId, accessToken, 'publicProfiles').catch(() => []),
      firestoreListCollection(projectId, accessToken, 'users', { showMissing: true }).catch(() => []),
    ]);

    const uidSet = new Set();
    for (const d of profilesDocs) if (d?.id) uidSet.add(d.id);
    for (const d of usersDocs) if (d?.id) uidSet.add(d.id);

    let checkedUsers = 0;
    let notificationsSent = 0;
    let tokensRemoved = 0;

    for (const uid of uidSet) {
      const config = await firestoreGetDoc(projectId, accessToken, `users/${uid}/settings/config`).catch(() => null);
      if (!config || !config.examRemindersEnabled) continue;
      if (extractTokensFromConfig(config).length === 0) continue;

      const reminderTime = String(config.examReminderTime || '18:00');
      const reminderHour = parseInt(reminderTime.split(':')[0], 10);
      if (!forceAllHours && Number.isFinite(reminderHour) && reminderHour !== currentHour) continue;

      checkedUsers++;
      const reminderDays = typeof config.examReminderDays === 'number' ? config.examReminderDays : 1;
      const sentMap = (config.pushSentDates && typeof config.pushSentDates === 'object') ? { ...config.pushSentDates } : {};

      const [tasks, subsUpper, subsLower] = await Promise.all([
        firestoreListCollection(projectId, accessToken, `users/${uid}/tasks`).catch(() => []),
        firestoreListCollection(projectId, accessToken, `users/${uid}/subjects`).catch(() => []),
        firestoreListCollection(projectId, accessToken, `users/${uid}/subjects_lower`).catch(() => []),
      ]);

      const subjectsById = {};
      for (const s of [...subsUpper, ...subsLower]) {
        if (s?.id) subjectsById[s.id] = s;
      }

      let didSendForUser = false;
      for (const task of tasks) {
        if (!task || task.done) continue;
        if (task.type !== 'Klausur' && task.type !== 'Test') continue;

        const daysUntil = diffDaysYmd(task.date, todayStr);
        if (!Number.isFinite(daysUntil) || daysUntil < 0 || daysUntil > reminderDays) continue;
        if (sentMap[task.id] === todayStr) continue;

        const subject = subjectsById[task.subjectId];
        const dayLabel = daysUntil === 0 ? 'heute' : daysUntil === 1 ? 'morgen' : `in ${daysUntil} Tagen`;
        const subjectPrefix = subject?.name ? `${subject.name}: ` : '';

        const pushRes = await sendPushToUserConfig(projectId, accessToken, uid, config, {
          title: `${task.type} ${dayLabel}`,
          body: `${subjectPrefix}${task.title || task.type}`,
          tag: `sf-exam-${task.id}-${todayStr}`,
          link: '/',
          data: { type: 'exam_reminder', taskId: task.id, date: task.date },
        });

        tokensRemoved += pushRes.removedTokens;
        if (pushRes.sent > 0) {
          notificationsSent += pushRes.sent;
          sentMap[task.id] = todayStr;
          didSendForUser = true;
        }
      }

      if (didSendForUser) {
        // Prune stale entries older than today to keep config compact
        const pruned = {};
        for (const [k, v] of Object.entries(sentMap)) {
          if (v === todayStr) pruned[k] = v;
        }
        await firestorePatchFields(projectId, accessToken, `users/${uid}/settings/config`, {
          pushSentDates: pruned,
        }).catch(() => {});
      }
    }

    return res.status(200).json({
      ok: true,
      berlinDate: todayStr,
      berlinHour: currentHour,
      candidateUsers: uidSet.size,
      checkedUsers,
      notificationsSent,
      tokensRemoved,
    });
  } catch (err) {
    console.error('[Schooly Cron Reminders] Fehler:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Reminder dispatch failed' });
  }
}
