import { put, del } from '@vercel/blob';
import crypto from 'node:crypto';

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
  }
  return raw.trim() ? JSON.parse(raw) : {};
}

function constantTimeEquals(a, b) {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isSafeHttpsUrl(rawUrl) {
  try {
    const u = new URL(String(rawUrl || ''));
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '0.0.0.0' ||
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host === '169.254.169.254'
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function findBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim()) {
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v !== 'string') continue;
    const trimmed = v.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('vercel_blob_rw_') || /_READ_WRITE_TOKEN$/i.test(k)) {
      return trimmed;
    }
  }
  return '';
}

function hasBlobStoreConfigured() {
  return Boolean(findBlobToken() || (process.env.BLOB_STORE_ID && process.env.BLOB_STORE_ID.trim()));
}

function signMediaPathname(pathname) {
  const secret = (process.env.SOCIAL_ADMIN_SECRET || process.env.IG_ACCESS_TOKEN || '').trim();
  return crypto.createHmac('sha256', secret).update(pathname).digest('hex');
}

function getRequestOrigin(req) {
  const explicit = (process.env.IG_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  return host ? `${proto}://${host}` : '';
}

async function uploadTempSlideToBlob(req, blobPath, buffer, contentType, blobToken) {
  const baseOpts = { contentType, addRandomSuffix: false };
  if (blobToken) baseOpts.token = blobToken;

  try {
    const blob = await put(blobPath, buffer, { ...baseOpts, access: 'public' });
    return { publicUrl: blob.url, deleteKey: blob.url };
  } catch (publicErr) {
    const msg = String(publicErr?.message || '');
    if (!/private/i.test(msg)) {
      throw publicErr;
    }
    const blob = await put(blobPath, buffer, { ...baseOpts, access: 'private' });
    const origin = getRequestOrigin(req);
    if (!origin || !/^https:\/\//i.test(origin)) {
      throw new Error('Private Blob Store benötigt eine HTTPS-Origin für /api/ig-temp-media.');
    }
    const sig = signMediaPathname(blob.pathname);
    return {
      publicUrl: `${origin}/api/ig-temp-media?p=${encodeURIComponent(blob.pathname)}&sig=${sig}`,
      deleteKey: blob.url || blob.pathname,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = (process.env.SOCIAL_ADMIN_SECRET || '').trim();
  if (!adminSecret) {
    return res.status(403).json({
      error: 'ADMIN_SECRET_NOT_CONFIGURED',
      message: 'Sicherheits-Schutz aktiv: Bitte zuerst SOCIAL_ADMIN_SECRET (ein eigenes Passwort) in den Vercel Environment Variables festlegen, damit niemand sonst auf @schooly.app posten kann.',
    });
  }

  const providedSecret = String(req.headers['x-social-secret'] || '').trim();
  if (!providedSecret || !constantTimeEquals(providedSecret, adminSecret)) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Falsches oder fehlendes Admin-Passwort. Bitte dein SOCIAL_ADMIN_SECRET eingeben.',
    });
  }

  let body = {};
  try {
    body = await parseJsonBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (body.action === 'verify-secret') {
    return res.status(200).json({ ok: true });
  }

  let igUserId = (process.env.IG_USER_ID || '').trim();
  const igAccessToken = (process.env.IG_ACCESS_TOKEN || '').trim();
  if (!igAccessToken) {
    return res.status(503).json({
      error: 'IG_NOT_CONFIGURED',
      message: 'Für automatisches Posten bitte IG_ACCESS_TOKEN in den Vercel Environment Variables hinterlegen.',
    });
  }

  const blobToken = findBlobToken();
  const blobReady = hasBlobStoreConfigured();

  // Stage 1: Upload a single rendered slide to Vercel Blob (supports both Public & Private Blob stores)
  if (body.action === 'stage-slide') {
    if (!blobReady) {
      return res.status(400).json({
        error: 'VERCEL_BLOB_REQUIRED',
        message: 'Auf Vercel fehlt noch die Verknüpfung zum Vercel Blob Store (BLOB_STORE_ID oder BLOB_READ_WRITE_TOKEN).',
      });
    }

    const dataUrl = String(body.slide || '');
    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Ungültiges Bildformat (erwartet JPEG oder PNG).' });
    }

    const ext = match[1] === 'png' ? 'png' : 'jpg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const idx = Number.isInteger(body.index) ? body.index : 0;
    const rand = Math.random().toString(36).slice(2, 8);
    const blobPath = `schooly-ig-temp/${Date.now()}_${idx}_${rand}.${ext}`;

    try {
      const buffer = Buffer.from(match[2], 'base64');
      const uploaded = await uploadTempSlideToBlob(req, blobPath, buffer, contentType, blobToken);
      return res.status(200).json({ ok: true, url: uploaded.publicUrl });
    } catch (err) {
      return res.status(502).json({
        error: 'BLOB_UPLOAD_FAILED',
        message: `Vercel Blob Upload fehlgeschlagen: ${err?.message || 'Unbekannter Fehler'}`,
      });
    }
  }

  // Stage 2: Publish staged mediaUrls (or direct slides) via Meta Graph API
  const caption = typeof body.caption === 'string' ? body.caption : '';
  const rawMediaUrls = Array.isArray(body.mediaUrls) ? body.mediaUrls : [];
  const rawSlides = Array.isArray(body.slides) ? body.slides : [];

  const blobsToDelete = [];
  let mediaUrls = [];

  let graphBase = igAccessToken.startsWith('IG')
    ? 'https://graph.instagram.com/v21.0'
    : 'https://graph.facebook.com/v21.0';

  const formatMetaError = (errObj, fallback) => {
    const msg = String(errObj?.message || '');
    const code = Number(errObj?.code);
    if (code === 4 || code === 17 || code === 32 || /request limit/i.test(msg)) {
      return 'Meta Rate-Limit erreicht („Application request limit reached“): Deine Meta-App hat das stündliche Test-Limit kurz überschritten. Bitte ca. 15–60 Minuten warten und dann noch einmal auf „Direkt auf Instagram posten“ klicken (der Beitrag wird nicht doppelt gepostet).';
    }
    return msg || fallback;
  };

  const waitForContainerFinished = async (containerId, initialDelayMs = 2500) => {
    if (initialDelayMs > 0) {
      await new Promise((r) => setTimeout(r, initialDelayMs));
    }
    for (let attempt = 0; attempt < 12; attempt++) {
      const statusUrl = `${graphBase}/${encodeURIComponent(containerId)}?fields=status_code,status&access_token=${encodeURIComponent(igAccessToken)}`;
      const statusRes = await fetch(statusUrl);
      const statusJson = await statusRes.json().catch(() => ({}));
      if (statusJson?.error) {
        throw new Error(formatMetaError(statusJson.error, 'Fehler beim Prüfen des Instagram-Medienstatus.'));
      }
      const code = statusJson?.status_code;
      if (code === 'FINISHED' || code === 'PUBLISHED') return;
      if (code === 'ERROR' || code === 'EXPIRED') {
        const detail = statusJson?.status ? ` (${statusJson.status})` : '';
        throw new Error(`Instagram Medien-Container Status: ${code}${detail}`);
      }
      await new Promise((r) => setTimeout(r, 2500));
    }
    throw new Error('Zeitüberschreitung beim Verarbeiten des Instagram Medien-Containers.');
  };

  try {
    if (rawMediaUrls.length > 0) {
      if (rawMediaUrls.length > 10) {
        return res.status(400).json({ error: 'Maximal 10 Slides pro Beitrag erlaubt.' });
      }
      for (const u of rawMediaUrls) {
        const urlStr = String(u || '');
        if (!isSafeHttpsUrl(urlStr)) {
          return res.status(400).json({ error: 'Ungültige oder unsichere Medien-URL.' });
        }
        mediaUrls.push(urlStr);
        if (/\.blob\.vercel-storage\.com\//i.test(urlStr)) {
          blobsToDelete.push(urlStr);
        } else {
          try {
            const parsed = new URL(urlStr);
            const p = parsed.searchParams.get('p');
            if (parsed.pathname.endsWith('/api/ig-temp-media') && p) {
              blobsToDelete.push(p);
            }
          } catch {}
        }
      }
    } else if (rawSlides.length > 0) {
      if (!blobReady) {
        return res.status(400).json({
          error: 'VERCEL_BLOB_REQUIRED',
          message: 'Auf Vercel fehlt noch die Verknüpfung zum Vercel Blob Store (BLOB_STORE_ID oder BLOB_READ_WRITE_TOKEN).',
        });
      }
      if (rawSlides.length > 10) {
        return res.status(400).json({ error: 'Maximal 10 Slides pro Beitrag erlaubt.' });
      }
      for (let i = 0; i < rawSlides.length; i++) {
        const match = String(rawSlides[i] || '').match(/^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/);
        if (!match) {
          throw new Error(`Slide ${i + 1} ist kein gültiges JPEG/PNG-Bild.`);
        }
        const ext = match[1] === 'png' ? 'png' : 'jpg';
        const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
        const blobPath = `schooly-ig-temp/${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const uploaded = await uploadTempSlideToBlob(req, blobPath, Buffer.from(match[2], 'base64'), contentType, blobToken);
        mediaUrls.push(uploaded.publicUrl);
        blobsToDelete.push(uploaded.deleteKey);
      }
    } else {
      return res.status(400).json({ error: 'Keine Slides oder Medien-URLs übergeben.' });
    }

    if (!igUserId || igUserId.toLowerCase() === 'me') {
      if (igAccessToken.startsWith('IG')) {
        const meRes = await fetch(`${graphBase}/me?fields=user_id,id,username&access_token=${encodeURIComponent(igAccessToken)}`);
        const meJson = await meRes.json().catch(() => ({}));
        igUserId = String(meJson?.user_id || meJson?.id || '').trim();
        if (!igUserId) {
          throw new Error(formatMetaError(meJson?.error, 'Instagram Konto-ID konnte nicht automatisch aus dem Token ermittelt werden.'));
        }
      } else {
        // 1) Try Facebook User Token -> /me/accounts
        const accRes = await fetch(`${graphBase}/me/accounts?fields=id,name,instagram_business_account,connected_instagram_account&access_token=${encodeURIComponent(igAccessToken)}`);
        const accJson = await accRes.json().catch(() => ({}));
        const pages = Array.isArray(accJson?.data) ? accJson.data : [];
        const foundPage = pages.find((p) => p?.instagram_business_account?.id || p?.connected_instagram_account?.id);
        igUserId = String(foundPage?.instagram_business_account?.id || foundPage?.connected_instagram_account?.id || '').trim();

        // 2) Try Facebook Page Token -> /me?fields=instagram_business_account,connected_instagram_account
        if (!igUserId) {
          const fbMeRes = await fetch(`${graphBase}/me?fields=id,name,instagram_business_account,connected_instagram_account&access_token=${encodeURIComponent(igAccessToken)}`);
          const fbMeJson = await fbMeRes.json().catch(() => ({}));
          igUserId = String(fbMeJson?.instagram_business_account?.id || fbMeJson?.connected_instagram_account?.id || '').trim();
        }

        // 3) Fallback probe on graph.instagram.com/me in case token works with Instagram Login API
        if (!igUserId) {
          const igMeRes = await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,id,username&access_token=${encodeURIComponent(igAccessToken)}`);
          const igMeJson = await igMeRes.json().catch(() => ({}));
          const probedId = String(igMeJson?.user_id || igMeJson?.id || '').trim();
          if (igMeRes.ok && probedId) {
            igUserId = probedId;
            graphBase = 'https://graph.instagram.com/v21.0';
          }
        }

        if (!igUserId) {
          if (accJson?.error) {
            throw new Error(formatMetaError(accJson.error, 'Meta API Fehler bei Kontoabfrage.'));
          }
          if (pages.length > 0) {
            const pageNames = pages.map((p) => p.name || p.id).filter(Boolean).join(', ');
            throw new Error(`Facebook-Seite(n) gefunden (${pageNames}), aber @schooly.app ist noch mit keiner davon als Instagram Business-Konto verknüpft (oder IG_USER_ID in Vercel direkt setzen).`);
          }
          throw new Error('Dein Token liefert keine verknüpfte Facebook-Seite mit Instagram-Business-Konto zurück. Entweder IG_USER_ID in Vercel setzen, beim Token-Erstellen deine Seite + @schooly.app anhaken oder einen Instagram-Login-Token (startet mit IG...) unter „Instagram-API einrichten“ generieren.');
        }
      }
    }

    const graphCreateUrl = `${graphBase}/${encodeURIComponent(igUserId)}/media`;
    let topCreationId = '';

    if (mediaUrls.length === 1) {
      const params = new URLSearchParams({
        image_url: mediaUrls[0],
        caption,
        access_token: igAccessToken,
      });
      const r = await fetch(graphCreateUrl, { method: 'POST', body: params });
      const j = await r.json();
      if (!r.ok || !j?.id) {
        throw new Error(formatMetaError(j?.error, 'Instagram Container konnte nicht erstellt werden.'));
      }
      topCreationId = j.id;
      await waitForContainerFinished(topCreationId, 2500);
    } else {
      const childIds = [];
      for (let i = 0; i < mediaUrls.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 180));
        const params = new URLSearchParams({
          image_url: mediaUrls[i],
          is_carousel_item: 'true',
          access_token: igAccessToken,
        });
        const r = await fetch(graphCreateUrl, { method: 'POST', body: params });
        const j = await r.json();
        if (!r.ok || !j?.id) {
          throw new Error(formatMetaError(j?.error, 'Carousel-Slide konnte nicht hochgeladen werden.'));
        }
        childIds.push(j.id);
      }

      await new Promise((r) => setTimeout(r, 2500));
      for (const childId of childIds) {
        await waitForContainerFinished(childId, 0);
      }

      const carouselParams = new URLSearchParams({
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption,
        access_token: igAccessToken,
      });
      const cr = await fetch(graphCreateUrl, { method: 'POST', body: carouselParams });
      const cj = await cr.json();
      if (!cr.ok || !cj?.id) {
        throw new Error(formatMetaError(cj?.error, 'Instagram Carousel-Container fehlgeschlagen.'));
      }
      topCreationId = cj.id;
      await waitForContainerFinished(topCreationId, 2000);
    }

    const publishParams = new URLSearchParams({
      creation_id: topCreationId,
      access_token: igAccessToken,
    });
    const pubRes = await fetch(`${graphBase}/${encodeURIComponent(igUserId)}/media_publish`, {
      method: 'POST',
      body: publishParams,
    });
    const pubJson = await pubRes.json();
    if (!pubRes.ok || !pubJson?.id) {
      throw new Error(formatMetaError(pubJson?.error, 'Veröffentlichung über media_publish fehlgeschlagen.'));
    }

    return res.status(200).json({ ok: true, id: pubJson.id });
  } catch (err) {
    return res.status(502).json({ error: err?.message || 'Instagram-Veröffentlichung fehlgeschlagen.' });
  } finally {
    if (blobReady && blobsToDelete.length > 0) {
      await del(blobsToDelete, blobToken ? { token: blobToken } : undefined).catch(() => {});
    }
  }
}
