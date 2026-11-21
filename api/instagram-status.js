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
  if (findBlobToken()) return true;
  if (process.env.BLOB_STORE_ID && process.env.BLOB_STORE_ID.trim()) return true;
  return false;
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hasToken = Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_ACCESS_TOKEN.trim());
  const hasBlob = hasBlobStoreConfigured();
  const hasPublicUrl = Boolean(process.env.IG_PUBLIC_BASE_URL && process.env.IG_PUBLIC_BASE_URL.trim());
  const hasAdminSecret = Boolean(process.env.SOCIAL_ADMIN_SECRET && process.env.SOCIAL_ADMIN_SECRET.trim());

  return res.status(200).json({
    configured: hasToken,
    blobConfigured: hasBlob,
    publicBaseUrlConfigured: hasBlob || hasPublicUrl,
    requiresAdminSecret: true,
    adminSecretConfigured: hasAdminSecret,
    runtime: 'vercel',
    accountHandle: '@schooly.app',
  });
}
