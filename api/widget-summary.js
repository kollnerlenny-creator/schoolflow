import crypto from 'node:crypto';
import {
  hasServiceAccountEnv,
  parseServiceAccount,
  getGoogleAccessToken,
  verifyFirebaseIdToken,
  firestoreGetDoc,
  firestoreListCollection,
  firestorePatchFields,
  firestoreSetDoc,
  firestoreDeleteDoc,
} from './_fcm.js';

const WIDGET_TOKEN_RE = /^sf_w_[a-f0-9]{48}$/;

function sha256Hex(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function getBerlinTodayStr() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getBerlinTimeHm() {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

function diffDaysYmd(targetYmd, baseYmd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(targetYmd || ''))) return NaN;
  const t = new Date(`${targetYmd}T00:00:00Z`);
  const b = new Date(`${baseYmd}T00:00:00Z`);
  return Math.round((t.getTime() - b.getTime()) / 86400000);
}

function formatGermanShortDate(ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ymd || ''))) return '';
  const [, m, d] = ymd.split('-');
  return `${d}.${m}.`;
}

function formatCountdownLabel(daysUntil) {
  if (daysUntil <= 0) return 'Heute';
  if (daysUntil === 1) return 'Morgen';
  return `in ${daysUntil} Tagen`;
}

function computeCurrentHalfYearBerlin(currentClassNum, startYear) {
  const todayStr = getBerlinTodayStr();
  const [y, m] = todayStr.split('-').map(Number);
  const isFirstHalf = m >= 8 || m === 1;
  const halfNum = isFirstHalf ? 1 : 2;
  const currentSchoolYear = m >= 8 ? y : y - 1;
  const cls = Number(currentClassNum) || 11;
  if (cls >= 11) {
    const sy = Number(startYear) || 0;
    let gradeLevel = cls;
    if (sy > 0) {
      const diff = currentSchoolYear - sy;
      gradeLevel = diff >= 1 ? 12 : 11;
    }
    return `${gradeLevel}/${halfNum}`;
  }
  return `${cls}/${halfNum}`;
}

function determineSemesterFromDate(dateStr, fallbackHalfYear, currentClassNum, startYear) {
  if (!dateStr) return fallbackHalfYear;
  const d = new Date(`${String(dateStr).slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return fallbackHalfYear;
  const m = d.getUTCMonth() + 1;
  const y = d.getUTCFullYear();
  const halfNum = (m >= 8 || m === 1) ? 1 : 2;

  if (Number(currentClassNum) >= 11) {
    const todayParts = getBerlinTodayStr().split('-').map(Number);
    const nowM = todayParts[1];
    const nowY = todayParts[0];
    const currentSchoolYear = nowM >= 8 ? nowY : nowY - 1;
    const dateSchoolYear = m >= 8 ? y : y - 1;
    const sy = Number(startYear) || (Number(currentClassNum) === 12 ? currentSchoolYear - 1 : currentSchoolYear);
    const semGrade = (dateSchoolYear - sy) >= 1 ? 12 : 11;
    return `${semGrade}/${halfNum}`;
  }
  return `${Number(currentClassNum) || 10}/${halfNum}`;
}

function pointsToGrade(p) {
  if (p === null || p === undefined || Number.isNaN(Number(p))) return null;
  return Math.max(1.0, Math.min(6.0, (17 - Number(p)) / 3));
}

async function buildWidgetSummaryForUser(projectId, accessToken, uid) {
  const config = (await firestoreGetDoc(projectId, accessToken, `users/${uid}/settings/config`).catch(() => null)) || {};
  const currentClass = Number(config.currentClass) || 11;
  const startYear = Number(config.startYear) || 0;
  const gradeSystem = config.gradeSystem ? (config.gradeSystem === '6' ? '6' : '15') : (currentClass <= 10 ? '6' : '15');
  const lkBonusActive = config.lkBonusActive !== false;
  const subjectCol = currentClass >= 11 ? 'subjects' : 'subjects_lower';
  const halfYear = computeCurrentHalfYearBerlin(currentClass, startYear);

  const [subjects, tasks] = await Promise.all([
    firestoreListCollection(projectId, accessToken, `users/${uid}/${subjectCol}`).catch(() => []),
    firestoreListCollection(projectId, accessToken, `users/${uid}/tasks`).catch(() => []),
  ]);

  let relevantSemesters = [halfYear];
  if (currentClass <= 10) {
    const [cls, hj] = halfYear.split('/').map(Number);
    if (hj === 2) relevantSemesters = [`${cls}/1`, `${cls}/2`];
  }

  const subjectsById = {};
  for (const s of subjects) {
    if (s?.id) subjectsById[s.id] = s;
  }

  let sumPoints = 0;
  let sumWeight = 0;
  let activeSubjectsCount = 0;

  for (const s of subjects) {
    const allGrades = Array.isArray(s?.grades) ? s.grades : [];
    const grades = allGrades.filter((g) => {
      if (!g || g.pending) return false;
      const gSem = g.semester ? String(g.semester).replace('.', '/') : '';
      return relevantSemesters.includes(gSem) || (!gSem && g.date && determineSemesterFromDate(g.date, halfYear, currentClass, startYear) === halfYear);
    });

    const exams = grades.filter((g) => g.type === 'Klausur');
    const others = grades.filter((g) => g.type !== 'Klausur');
    const overrideW = s?.examWeightByHalfYear?.[halfYear];
    const resolvedExamWeight = (overrideW !== undefined && overrideW !== null) ? Number(overrideW) : (Number(s?.examWeight ?? 50) || 50);
    const wE = resolvedExamWeight / 100;
    const wO = 1 - wE;
    const avgE = exams.length ? exams.reduce((a, b) => a + (Number(b.points) || 0), 0) / exams.length : null;
    const avgO = others.length ? others.reduce((a, b) => a + (Number(b.points) || 0), 0) / others.length : null;

    let finalPoints = null;
    if (avgE !== null && avgO !== null) finalPoints = (avgE * wE) + (avgO * wO);
    else if (avgE !== null) finalPoints = avgE;
    else if (avgO !== null) finalPoints = avgO;

    const rcg = s?.reportCardGrades?.[halfYear] ?? null;
    const effective = rcg !== null && rcg !== undefined ? Number(rcg) : finalPoints;
    if (effective === null || effective === undefined || Number.isNaN(effective)) continue;

    const weight = (s?.isLK && lkBonusActive) ? 2 : 1;
    sumPoints += effective * weight;
    sumWeight += weight;
    activeSubjectsCount++;
  }

  const avgValue = sumWeight > 0 ? sumPoints / sumWeight : 0;
  const hasGrades = sumWeight > 0;
  const equivalentGrade = (hasGrades && gradeSystem !== '6') ? pointsToGrade(avgValue) : null;

  const todayStr = getBerlinTodayStr();
  const upcomingOpenTasks = tasks
    .filter((t) => t && !t.done && /^\d{4}-\d{2}-\d{2}$/.test(String(t.date || '')))
    .map((t) => {
      const daysUntil = diffDaysYmd(t.date, todayStr);
      const subj = subjectsById[t.subjectId];
      return {
        id: String(t.id || ''),
        title: String(t.title || t.type || 'Aufgabe'),
        type: String(t.type || 'Aufgabe'),
        date: String(t.date),
        dateFormatted: formatGermanShortDate(t.date),
        daysUntil,
        dueLabel: formatCountdownLabel(daysUntil),
        subjectName: String(subj?.name || ''),
        subjectColor: String(subj?.color || '#2d694c'),
      };
    })
    .filter((t) => Number.isFinite(t.daysUntil) && t.daysUntil >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextExam = upcomingOpenTasks.find((t) => t.type === 'Klausur' || t.type === 'Test') || null;
  const resolvedColorMode = (config.colorMode === 'light' || config.colorMode === 'evening' || config.colorMode === 'dim' || config.colorMode === 'dark')
    ? config.colorMode
    : (config.darkMode ? 'dark' : 'light');

  return {
    colorMode: resolvedColorMode,
    average: {
      hasGrades,
      value: hasGrades ? Number(avgValue.toFixed(2)) : 0,
      displayValue: hasGrades ? avgValue.toFixed(1).replace('.', ',') : '–',
      unitLabel: gradeSystem === '6' ? 'Schnitt' : 'Pkt.',
      secondaryLabel: equivalentGrade !== null ? `≈ ${equivalentGrade.toFixed(1).replace('.', ',')} Note` : `${activeSubjectsCount} ${activeSubjectsCount === 1 ? 'Fach' : 'Fächer'}`,
      gradeSystem,
      halfYear,
      activeSubjectsCount,
    },
    nextExam: nextExam
      ? {
          id: nextExam.id,
          type: nextExam.type,
          title: nextExam.title,
          subjectName: nextExam.subjectName || nextExam.type,
          date: nextExam.date,
          dateFormatted: nextExam.dateFormatted,
          daysUntil: nextExam.daysUntil,
          countdownLabel: nextExam.dueLabel,
        }
      : null,
    tasks: {
      openCount: upcomingOpenTasks.length,
      items: upcomingOpenTasks.slice(0, 4).map((t) => ({
        id: t.id,
        title: t.title,
        type: t.type,
        subjectName: t.subjectName,
        dateFormatted: t.dateFormatted,
        daysUntil: t.daysUntil,
        dueLabel: t.dueLabel,
      })),
    },
    reminders: {
      enabled: config.examRemindersEnabled === true,
      daysBefore: Number.isFinite(Number(config.examReminderDays)) ? Number(config.examReminderDays) : 1,
      time: typeof config.examReminderTime === 'string' && /^\d{2}:\d{2}$/.test(config.examReminderTime) ? config.examReminderTime : '18:00',
    },
    updatedAt: new Date().toISOString(),
    updatedHm: getBerlinTimeHm(),
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const sa = parseServiceAccount();
  if (!sa) {
    if (hasServiceAccountEnv()) {
      return res.status(503).json({
        error: 'SERVER_INVALID_JSON',
        message: 'FIREBASE_SERVICE_ACCOUNT_JSON ist gesetzt, aber ungültig.',
      });
    }
    return res.status(503).json({
      error: 'SERVER_NOT_CONFIGURED',
      message: 'FIREBASE_SERVICE_ACCOUNT_JSON fehlt in den Server-Umgebungsvariablen.',
    });
  }

  try {
    const accessToken = await getGoogleAccessToken(sa);
    const projectId = sa.project_id;

    // GET: Widget fetch using personal widget token
    if (req.method === 'GET') {
      const headerToken = String(req.headers?.['x-widget-token'] || '').trim();
      const authHeader = String(req.headers?.authorization || '');
      const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const rawToken = headerToken || bearerToken;

      if (!WIDGET_TOKEN_RE.test(rawToken)) {
        return res.status(401).json({ error: 'INVALID_WIDGET_TOKEN' });
      }

      const tokenHash = sha256Hex(rawToken);
      const linkDoc = await firestoreGetDoc(projectId, accessToken, `widgetLinks/${tokenHash}`);
      const uid = typeof linkDoc?.uid === 'string' ? linkDoc.uid.trim() : '';
      if (!uid || !/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
        return res.status(401).json({ error: 'INVALID_WIDGET_TOKEN' });
      }

      const summary = await buildWidgetSummaryForUser(projectId, accessToken, uid);
      return res.status(200).json({ ok: true, summary });
    }

    // POST: Provision / rotate / revoke widget tokens (requires verified Firebase ID token)
    if (req.method === 'POST') {
      const authHeader = String(req.headers?.authorization || '');
      const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!idToken) {
        return res.status(401).json({ error: 'UNAUTHORIZED' });
      }

      let caller;
      try {
        caller = await verifyFirebaseIdToken(idToken, projectId);
      } catch (err) {
        return res.status(401).json({ error: 'INVALID_TOKEN', message: err?.message || 'Ungültige Anmeldung' });
      }

      const uid = caller.uid;
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      const action = String(body.action || 'provision');
      const existingToken = typeof body.existingToken === 'string' ? body.existingToken.trim() : '';

      const config = (await firestoreGetDoc(projectId, accessToken, `users/${uid}/settings/config`).catch(() => null)) || {};
      const existingHashes = Array.isArray(config.widgetTokenHashes)
        ? config.widgetTokenHashes.filter((h) => typeof h === 'string' && /^[a-f0-9]{64}$/.test(h))
        : [];

      if (action === 'revoke_all') {
        await Promise.all(
          existingHashes.map((h) => firestoreDeleteDoc(projectId, accessToken, `widgetLinks/${h}`).catch(() => {}))
        );
        await firestorePatchFields(projectId, accessToken, `users/${uid}/settings/config`, {
          widgetTokenHashes: [],
          widgetTokenUpdatedAt: new Date().toISOString(),
        });
        return res.status(200).json({ ok: true, revoked: existingHashes.length });
      }

      if (action === 'provision' && WIDGET_TOKEN_RE.test(existingToken)) {
        const existingHash = sha256Hex(existingToken);
        if (existingHashes.includes(existingHash)) {
          const linkCheck = await firestoreGetDoc(projectId, accessToken, `widgetLinks/${existingHash}`).catch(() => null);
          if (linkCheck?.uid === uid) {
            const summary = await buildWidgetSummaryForUser(projectId, accessToken, uid);
            return res.status(200).json({ ok: true, token: existingToken, reused: true, summary });
          }
        }
      }

      if (action !== 'provision' && action !== 'rotate') {
        return res.status(400).json({ error: 'UNKNOWN_ACTION' });
      }

      const rawToken = `sf_w_${crypto.randomBytes(24).toString('hex')}`;
      const newHash = sha256Hex(rawToken);
      const nowIso = new Date().toISOString();

      let nextHashes;
      if (action === 'rotate') {
        await Promise.all(
          existingHashes.map((h) => firestoreDeleteDoc(projectId, accessToken, `widgetLinks/${h}`).catch(() => {}))
        );
        nextHashes = [newHash];
      } else {
        const combined = [...existingHashes.filter((h) => h !== newHash), newHash];
        const excess = combined.length > 5 ? combined.slice(0, combined.length - 5) : [];
        nextHashes = combined.slice(-5);
        await Promise.all(
          excess.map((h) => firestoreDeleteDoc(projectId, accessToken, `widgetLinks/${h}`).catch(() => {}))
        );
      }

      await firestoreSetDoc(projectId, accessToken, `widgetLinks/${newHash}`, {
        uid,
        createdAt: nowIso,
      });
      await firestorePatchFields(projectId, accessToken, `users/${uid}/settings/config`, {
        widgetTokenHashes: nextHashes,
        widgetTokenUpdatedAt: nowIso,
      });

      const summary = await buildWidgetSummaryForUser(projectId, accessToken, uid);
      return res.status(200).json({ ok: true, token: rawToken, rotated: action === 'rotate', summary });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[Schooly Widget Summary] Fehler:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Widget summary failed' });
  }
}
