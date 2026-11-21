export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hasToken = Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_ACCESS_TOKEN.trim());
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim());
  const hasPublicUrl = Boolean(process.env.IG_PUBLIC_BASE_URL && process.env.IG_PUBLIC_BASE_URL.trim());

  return res.status(200).json({
    configured: hasToken,
    blobConfigured: hasBlobToken,
    publicBaseUrlConfigured: hasBlobToken || hasPublicUrl,
    runtime: 'vercel',
    accountHandle: '@schooly.app',
  });
}
