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
    if (/BLOB.*_READ_WRITE_TOKEN$/i.test(k) && typeof v === 'string' && v.trim()) {
      return v.trim();
    }
  }
  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require SOCIAL_ADMIN_SECRET on public Vercel deployments so strangers cannot post to @schooly.app
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
      message: 'Falsches oder fehlendes Admin-Passwort. Bitte oben im Status-Banner zuerst dein SOCIAL_ADMIN_SECRET eingeben.',
    });
  }

  let igUserId = (process.env.IG_USER_ID || '').trim();
  const igAccessToken = (process.env.IG_ACCESS_TOKEN || '').trim();
  if (!igAccessToken) {
    return res.status(503).json({
      error: 'IG_NOT_CONFIGURED',
      message: 'Für automatisches Posten bitte IG_ACCESS_TOKEN in den Vercel Environment Variables hinterlegen.',
    });
  }

  let body = {};
  try {
    body = await parseJsonBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const blobToken = findBlobToken();

  // Stage 1: Upload a single rendered slide to Vercel Blob (avoids Vercel's 4.5 MB body limit)
  if (body.action === 'stage-slide') {
    if (!blobToken) {
      return res.status(400).json({
        error: 'VERCEL_BLOB_REQUIRED',
        message: 'Auf Vercel fehlt noch Vercel Blob (BLOB_READ_WRITE_TOKEN). Öffne dein Projekt in Vercel → Storage → Create Database → Blob, verknüpfe es mit dem Projekt und deploye einmal neu.',
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
      const blob = await put(blobPath, buffer, {
        access: 'public',
        contentType,
        addRandomSuffix: false,
        token: blobToken,
      });
      return res.status(200).json({ ok: true, url: blob.url });
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

  const uploadedBlobUrls = [];
  let mediaUrls = [];

  const graphBase = igAccessToken.startsWith('IG')
    ? 'https://graph.instagram.com/v21.0'
    : 'https://graph.facebook.com/v21.0';

  const waitForContainerFinished = async (containerId) => {
    for (let attempt = 0; attempt < 25; attempt++) {
      const statusUrl = `${graphBase}/${encodeURIComponent(containerId)}?fields=status_code,status&access_token=${encodeURIComponent(igAccessToken)}`;
      const statusRes = await fetch(statusUrl);
      const statusJson = await statusRes.json().catch(() => ({}));
      const code = statusJson?.status_code;
      if (code === 'FINISHED' || code === 'PUBLISHED') return;
      if (code === 'ERROR' || code === 'EXPIRED') {
        const detail = statusJson?.status ? ` (${statusJson.status})` : '';
        throw new Error(`Instagram Medien-Container Status: ${code}${detail}`);
      }
      await new Promise((r) => setTimeout(r, 1200));
    }
    throw new Error('Zeitüberschreitung beim Verarbeiten des Instagram Medien-Containers.');
  };

  try {
    if (rawMediaUrls.length > 0) {
      if (rawMediaUrls.length > 10) {
        return res.status(400).json({ error: 'Maximal 10 Slides pro Beitrag erlaubt.' });
      }
      for (const u of rawMediaUrls) {
        if (!isSafeHttpsUrl(u)) {
          return res.status(400).json({ error: 'Ungültige oder unsichere Medien-URL.' });
        }
        mediaUrls.push(String(u));
        if (/\.blob\.vercel-storage\.com\//i.test(String(u))) {
          uploadedBlobUrls.push(String(u));
        }
      }
    } else if (rawSlides.length > 0) {
      if (!blobToken) {
        return res.status(400).json({
          error: 'VERCEL_BLOB_REQUIRED',
          message: 'Auf Vercel fehlt noch Vercel Blob (BLOB_READ_WRITE_TOKEN). Öffne Vercel → Storage → Create Database → Blob und verknüpfe es mit dem Projekt.',
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
        const blob = await put(blobPath, Buffer.from(match[2], 'base64'), {
          access: 'public',
          contentType,
          addRandomSuffix: false,
          token: blobToken,
        });
        mediaUrls.push(blob.url);
        uploadedBlobUrls.push(blob.url);
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
          throw new Error(meJson?.error?.message || 'Instagram Konto-ID konnte nicht automatisch aus dem Token ermittelt werden.');
        }
      } else {
        const accRes = await fetch(`${graphBase}/me/accounts?fields=instagram_business_account&access_token=${encodeURIComponent(igAccessToken)}`);
        const accJson = await accRes.json().catch(() => ({}));
        const pages = Array.isArray(accJson?.data) ? accJson.data : [];
        const foundPage = pages.find((p) => p?.instagram_business_account?.id);
        igUserId = String(foundPage?.instagram_business_account?.id || '').trim();
        if (!igUserId) {
          throw new Error(accJson?.error?.message || 'Kein verknüpftes Instagram Business-Konto gefunden. Bitte IG_USER_ID direkt setzen.');
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
        throw new Error(j?.error?.message || 'Instagram Container konnte nicht erstellt werden.');
      }
      topCreationId = j.id;
    } else {
      const childIds = await Promise.all(
        mediaUrls.map(async (imageUrl) => {
          const params = new URLSearchParams({
            image_url: imageUrl,
            is_carousel_item: 'true',
            access_token: igAccessToken,
          });
          const r = await fetch(graphCreateUrl, { method: 'POST', body: params });
          const j = await r.json();
          if (!r.ok || !j?.id) {
            throw new Error(j?.error?.message || 'Carousel-Slide konnte nicht hochgeladen werden.');
          }
          return j.id;
        })
      );

      await Promise.all(childIds.map((childId) => waitForContainerFinished(childId)));

      const carouselParams = new URLSearchParams({
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption,
        access_token: igAccessToken,
      });
      const cr = await fetch(graphCreateUrl, { method: 'POST', body: carouselParams });
      const cj = await cr.json();
      if (!cr.ok || !cj?.id) {
        throw new Error(cj?.error?.message || 'Instagram Carousel-Container fehlgeschlagen.');
      }
      topCreationId = cj.id;
    }

    await waitForContainerFinished(topCreationId);

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
      throw new Error(pubJson?.error?.message || 'Veröffentlichung über media_publish fehlgeschlagen.');
    }

    return res.status(200).json({ ok: true, id: pubJson.id });
  } catch (err) {
    return res.status(502).json({ error: err?.message || 'Instagram-Veröffentlichung fehlgeschlagen.' });
  } finally {
    if (blobToken && uploadedBlobUrls.length > 0) {
      await del(uploadedBlobUrls, { token: blobToken }).catch(() => {});
    }
  }
}
