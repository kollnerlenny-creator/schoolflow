import { get } from '@vercel/blob';
import crypto from 'node:crypto';

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

function getSigningSecret() {
  return (process.env.SOCIAL_ADMIN_SECRET || process.env.IG_ACCESS_TOKEN || '').trim();
}

function verifySignature(pathname, sig) {
  const secret = getSigningSecret();
  if (!secret || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(pathname).digest('hex');
  const bufA = Buffer.from(String(sig), 'utf8');
  const bufB = Buffer.from(expected, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).send('Method not allowed');
  }

  const reqUrl = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
  const pathname = String(reqUrl.searchParams.get('p') || '').trim();
  const sig = String(reqUrl.searchParams.get('sig') || '').trim();

  if (!/^schooly-ig-temp\/[a-zA-Z0-9_-]+\.(png|jpe?g)$/.test(pathname)) {
    return res.status(400).send('Invalid media path');
  }
  if (!verifySignature(pathname, sig)) {
    return res.status(403).send('Forbidden');
  }

  const blobToken = findBlobToken();
  const options = { access: 'private', useCache: false };
  if (blobToken) options.token = blobToken;

  try {
    const result = await get(pathname, options);
    if (!result || result.statusCode !== 200 || !result.stream) {
      return res.status(404).send('Media not found');
    }

    const buf = Buffer.from(await new Response(result.stream).arrayBuffer());
    const contentType = result.blob?.contentType || (pathname.endsWith('.png') ? 'image/png' : 'image/jpeg');

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Length', String(buf.length));
    if (req.method === 'HEAD') {
      return res.end();
    }
    return res.end(buf);
  } catch {
    return res.status(404).send('Media not found');
  }
}
