import crypto from 'node:crypto';

let cachedOAuth = { token: '', expiresAt: 0, clientEmail: '' };
let cachedCerts = { map: null, expiresAt: 0 };

export function parseServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
  if (!raw) return null;

  const tryParse = (str) => {
    const obj = JSON.parse(str);
    if (!obj || !obj.project_id || !obj.client_email || !obj.private_key) return null;
    if (typeof obj.private_key === 'string') {
      obj.private_key = obj.private_key.replace(/\\n/g, '\n');
    }
    return obj;
  };

  try {
    return tryParse(raw);
  } catch (_) {
    try {
      const decoded = Buffer.from(raw, 'base64').toString('utf8');
      return tryParse(decoded);
    } catch (_) {
      return null;
    }
  }
}

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str) {
  const normalized = String(str).replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64');
}

export async function getGoogleAccessToken(sa) {
  const nowSec = Math.floor(Date.now() / 1000);
  if (
    cachedOAuth.token &&
    cachedOAuth.clientEmail === sa.client_email &&
    cachedOAuth.expiresAt > nowSec + 60
  ) {
    return cachedOAuth.token;
  }

  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = base64UrlEncode(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  }));
  const unsigned = `${header}.${claimSet}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = base64UrlEncode(signer.sign(sa.private_key));
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(json?.error_description || json?.error || 'Google OAuth token exchange failed');
  }

  cachedOAuth = {
    token: json.access_token,
    expiresAt: nowSec + Number(json.expires_in || 3600),
    clientEmail: sa.client_email,
  };
  return cachedOAuth.token;
}

export async function verifyFirebaseIdToken(idToken, expectedProjectId) {
  if (!idToken || typeof idToken !== 'string' || !expectedProjectId) {
    throw new Error('Missing token or project ID');
  }
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');

  const header = JSON.parse(base64UrlDecode(parts[0]).toString('utf8'));
  const payload = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
  if (header?.alg !== 'RS256' || !header?.kid) throw new Error('Invalid JWT header');

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload?.aud !== expectedProjectId) throw new Error('Invalid token audience');
  if (payload?.iss !== `https://securetoken.google.com/${expectedProjectId}`) throw new Error('Invalid token issuer');
  if (!payload?.sub || typeof payload.sub !== 'string') throw new Error('Invalid token subject');
  if (typeof payload.exp !== 'number' || payload.exp <= nowSec) throw new Error('Token expired');
  if (typeof payload.iat !== 'number' || payload.iat > nowSec + 300) throw new Error('Invalid token issued-at');

  if (!cachedCerts.map || cachedCerts.expiresAt <= Date.now()) {
    const certRes = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', {
      signal: AbortSignal.timeout(10000),
    });
    if (!certRes.ok) throw new Error('Failed to fetch Firebase auth certificates');
    const cc = certRes.headers.get('cache-control') || '';
    const maxAgeMatch = cc.match(/max-age=(\d+)/i);
    const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 3600 * 1000;
    cachedCerts = {
      map: await certRes.json(),
      expiresAt: Date.now() + maxAgeMs,
    };
  }

  const pem = cachedCerts.map?.[header.kid];
  if (!pem) throw new Error('Unknown signing key');

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${parts[0]}.${parts[1]}`);
  const valid = verifier.verify(pem, base64UrlDecode(parts[2]));
  if (!valid) throw new Error('Invalid token signature');

  return { uid: payload.sub, email: payload.email || '' };
}

function decodeFirestoreValue(v) {
  if (!v || typeof v !== 'object') return undefined;
  if ('nullValue' in v) return null;
  if ('booleanValue' in v) return Boolean(v.booleanValue);
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('stringValue' in v) return String(v.stringValue);
  if ('timestampValue' in v) return String(v.timestampValue);
  if ('arrayValue' in v) {
    const vals = v.arrayValue?.values || [];
    return vals.map(decodeFirestoreValue);
  }
  if ('mapValue' in v) {
    const fields = v.mapValue?.fields || {};
    const out = {};
    for (const [k, val] of Object.entries(fields)) {
      out[k] = decodeFirestoreValue(val);
    }
    return out;
  }
  return undefined;
}

export function encodeFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = encodeFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function docToJs(doc) {
  const parts = String(doc?.name || '').split('/');
  const id = parts[parts.length - 1] || '';
  const data = {};
  for (const [k, v] of Object.entries(doc?.fields || {})) {
    data[k] = decodeFirestoreValue(v);
  }
  return { id, ...data };
}

export async function firestoreGetDoc(projectId, accessToken, docPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${docPath}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firestore GET ${docPath} failed (${res.status}): ${text}`);
  }
  return docToJs(await res.json());
}

export async function firestoreListCollection(projectId, accessToken, collectionPath, { showMissing = false } = {}) {
  const docs = [];
  let pageToken = '';
  do {
    const qs = new URLSearchParams({ pageSize: '300' });
    if (showMissing) qs.set('showMissing', 'true');
    if (pageToken) qs.set('pageToken', pageToken);
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${collectionPath}?${qs.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 404) break;
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Firestore LIST ${collectionPath} failed (${res.status}): ${text}`);
    }
    const json = await res.json();
    for (const d of json.documents || []) {
      docs.push(docToJs(d));
    }
    pageToken = json.nextPageToken || '';
  } while (pageToken);
  return docs;
}

export async function firestorePatchFields(projectId, accessToken, docPath, patchObj) {
  const keys = Object.keys(patchObj).filter((k) => patchObj[k] !== undefined);
  if (keys.length === 0) return;
  const qs = new URLSearchParams();
  for (const k of keys) {
    qs.append('updateMask.fieldPaths', k);
  }
  const fields = {};
  for (const k of keys) {
    fields[k] = encodeFirestoreValue(patchObj[k]);
  }
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${docPath}?${qs.toString()}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firestore PATCH ${docPath} failed (${res.status}): ${text}`);
  }
}

export function extractTokensFromConfig(config) {
  const set = new Set();
  if (Array.isArray(config?.fcmTokens)) {
    for (const t of config.fcmTokens) {
      if (typeof t === 'string' && t.trim()) set.add(t.trim());
    }
  }
  if (typeof config?.fcmToken === 'string' && config.fcmToken.trim()) {
    set.add(config.fcmToken.trim());
  }
  return Array.from(set);
}

export async function sendFcmWebPush(projectId, accessToken, token, { title, body, tag, link = '/', data = {} }) {
  const stringData = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v !== undefined && v !== null) stringData[k] = String(v);
  }
  if (tag) stringData.tag = String(tag);
  if (link) stringData.link = String(link);

  const message = {
    token,
    webpush: {
      headers: {
        Urgency: 'high',
      },
      notification: {
        title: String(title || 'Schooly'),
        body: String(body || ''),
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: String(tag || 'schooly-notification'),
        renotify: true,
      },
      fcm_options: {
        link: String(link || '/'),
      },
    },
    data: stringData,
  };

  const url = `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/messages:send`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (res.ok) {
    return { ok: true, unregistered: false };
  }

  const errJson = await res.json().catch(() => ({}));
  const details = errJson?.error?.details || [];
  const fcmCode = details.find((d) => d?.errorCode)?.errorCode || '';
  const msg = String(errJson?.error?.message || '');
  const unregistered =
    fcmCode === 'UNREGISTERED' ||
    res.status === 404 ||
    /requested entity was not found|not a valid fcm registration token/i.test(msg);

  return { ok: false, unregistered, error: fcmCode || msg || `HTTP ${res.status}` };
}

export async function sendPushToUserConfig(projectId, accessToken, uid, config, payload) {
  const tokens = extractTokensFromConfig(config);
  if (tokens.length === 0) return { sent: 0, failed: 0, removedTokens: 0 };

  const deadTokens = new Set();
  let sent = 0;
  let failed = 0;

  for (const tok of tokens) {
    const res = await sendFcmWebPush(projectId, accessToken, tok, payload);
    if (res.ok) {
      sent++;
    } else {
      failed++;
      if (res.unregistered) deadTokens.add(tok);
    }
  }

  if (deadTokens.size > 0) {
    const remaining = tokens.filter((t) => !deadTokens.has(t));
    await firestorePatchFields(projectId, accessToken, `users/${uid}/settings/config`, {
      fcmTokens: remaining,
      fcmToken: remaining[0] || '',
    }).catch(() => {});
  }

  return { sent, failed, removedTokens: deadTokens.size };
}
