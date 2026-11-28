import {
  hasServiceAccountEnv,
  parseServiceAccount,
  getGoogleAccessToken,
  verifyFirebaseIdToken,
  firestoreGetDoc,
  extractTokensFromConfig,
  sendFcmWebPush,
  sendPushToUserConfig,
} from './_fcm.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sa = parseServiceAccount();
  if (!sa) {
    if (hasServiceAccountEnv()) {
      return res.status(503).json({
        error: 'PUSH_SERVER_INVALID_JSON',
        message: 'FIREBASE_SERVICE_ACCOUNT_JSON ist gesetzt, aber ungültig. Bitte kompletten Inhalt der Firebase-.json-Datei unverändert einfügen.',
      });
    }
    return res.status(503).json({
      error: 'PUSH_SERVER_NOT_CONFIGURED',
      message: 'FIREBASE_SERVICE_ACCOUNT_JSON fehlt noch in den Server-Umgebungsvariablen.',
    });
  }

  const authHeader = String(req.headers?.authorization || '');
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!idToken) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  let caller;
  try {
    caller = await verifyFirebaseIdToken(idToken, sa.project_id);
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: err?.message || 'Ungültige Anmeldung' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const action = String(body.action || '');
  const reqHost = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').split(',')[0].trim();
  const safeOriginLink = reqHost && !/localhost|127\.0\.0\.1/i.test(reqHost) ? `https://${reqHost}/` : '/';

  try {
    const accessToken = await getGoogleAccessToken(sa);
    const projectId = sa.project_id;

    if (action === 'test') {
      const targetToken = typeof body.targetToken === 'string' ? body.targetToken.trim() : '';
      const rawDelay = Number(body.delayMs || 0);
      const delayMs = Number.isFinite(rawDelay) ? Math.max(0, Math.min(6000, Math.round(rawDelay))) : 0;

      const config = await firestoreGetDoc(projectId, accessToken, `users/${caller.uid}/settings/config`);
      const savedTokens = extractTokensFromConfig(config);
      if (!targetToken && savedTokens.length === 0) {
        return res.status(400).json({
          error: 'NO_DEVICE_TOKEN',
          message: 'Kein Push-Token für dieses Gerät gespeichert.',
        });
      }

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      const payload = {
        title: 'Schooly Sperrbildschirm-Push aktiv',
        body: 'Benachrichtigungen funktionieren auch bei geschlossener App.',
        tag: `sf-test-${Date.now()}`,
        link: safeOriginLink,
        data: { type: 'test_push' },
      };

      if (targetToken) {
        if (targetToken.length > 4096) {
          return res.status(400).json({ error: 'INVALID_TOKEN_FORMAT' });
        }
        const singleRes = await sendFcmWebPush(projectId, accessToken, targetToken, payload);
        if (!singleRes.ok) {
          return res.status(502).json({
            error: 'PUSH_DELIVERY_FAILED',
            message: `Zustellung an dieses Gerät fehlgeschlagen (${singleRes.error || 'unbekannt'}). Bitte Push aus- und wieder einschalten.`,
          });
        }
        return res.status(200).json({ ok: true, sent: 1, deviceTargeted: true });
      }

      const pushRes = await sendPushToUserConfig(projectId, accessToken, caller.uid, config, payload);
      if (pushRes.sent === 0) {
        return res.status(502).json({
          error: 'PUSH_DELIVERY_FAILED',
          message: 'Zustellung an das Gerät fehlgeschlagen. Bitte Push einmal aus- und wieder einschalten.',
        });
      }
      return res.status(200).json({ ok: true, sent: pushRes.sent });
    }

    if (action === 'friend_event') {
      const targetUid = String(body.targetUid || '').trim();
      const eventType = String(body.eventType || '').trim();
      const validUidRe = /^[A-Za-z0-9_-]{6,128}$/;
      if (
        !validUidRe.test(targetUid) ||
        !validUidRe.test(caller.uid) ||
        targetUid === caller.uid ||
        (eventType !== 'friend_request' && eventType !== 'friend_accepted')
      ) {
        return res.status(400).json({ error: 'INVALID_PARAMS' });
      }

      // Verify server-side that the caller actually wrote the matching friend notification document
      const notifId = eventType === 'friend_request' ? `fr_${caller.uid}` : `fa_${caller.uid}`;
      const notifDoc = await firestoreGetDoc(projectId, accessToken, `users/${targetUid}/notifications/${notifId}`);
      if (!notifDoc || notifDoc.fromUid !== caller.uid || notifDoc.type !== eventType) {
        return res.status(403).json({ error: 'FORBIDDEN' });
      }

      const targetConfig = await firestoreGetDoc(projectId, accessToken, `users/${targetUid}/settings/config`);
      if (!targetConfig || extractTokensFromConfig(targetConfig).length === 0) {
        return res.status(200).json({ ok: true, skipped: true, reason: 'target_no_push_token' });
      }

      const senderName = String(notifDoc.fromName || 'Jemand').slice(0, 60);
      const pushPayload = eventType === 'friend_request'
        ? {
            title: 'Neue Freundschaftsanfrage',
            body: `${senderName} möchte dich auf Schooly hinzufügen.`,
            tag: `sf-fr-${caller.uid}`,
            link: safeOriginLink,
            data: { type: 'friend_request', fromUid: caller.uid },
          }
        : {
            title: 'Freundschaftsanfrage angenommen',
            body: `${senderName} und du seid jetzt auf Schooly befreundet.`,
            tag: `sf-fa-${caller.uid}`,
            link: safeOriginLink,
            data: { type: 'friend_accepted', fromUid: caller.uid },
          };

      const pushRes = await sendPushToUserConfig(projectId, accessToken, targetUid, targetConfig, pushPayload);
      return res.status(200).json({ ok: true, sent: pushRes.sent });
    }

    return res.status(400).json({ error: 'UNKNOWN_ACTION' });
  } catch (err) {
    console.error('[Schooly Push Notify] Fehler:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Push request failed' });
  }
}
