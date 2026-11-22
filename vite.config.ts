import { defineConfig } from 'vite';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export default defineConfig({
  plugins: [
    {
      name: 'disable-vite-hmr-client',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(/<script\s+type="module"\s+src="\/@vite\/client"><\/script>\s*/gi, '');
        },
      },
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
          next();
        });

        server.middlewares.use('/@vite/client', (_req, res) => {
          res.setHeader('Content-Type', 'application/javascript');
          res.end(
            'export const createHotContext = () => ({ data: {}, accept(){}, acceptExports(){}, dispose(){}, prune(){}, invalidate(){}, decline(){}, on(){}, off(){}, send(){} });' +
            'export const updateStyle = () => {};' +
            'export const removeStyle = () => {};' +
            'export const injectQuery = (id) => id;'
          );
        });

        server.middlewares.use('/api/reel-voiceover', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let rawBody = '';
          for await (const chunk of req) {
            rawBody += chunk;
          }

          let body: { text?: string; voiceName?: string; style?: string } = {};
          try {
            body = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            res.statusCode = 503;
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }));
            return;
          }

          const scriptText = (body.text || '').trim() ||
            'Fünf Schul-Apps? Vergiss es. Mit schooly hast du Noten, Wunschnote, Stundenplan und Abirechner in einer einzigen App. Jetzt kostenlos starten!';
          const allowedVoices = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);
          const voiceName = allowedVoices.has(body.voiceName || '') ? body.voiceName! : 'Puck';
          const stylePrompt = body.style || 'Energetic, friendly young German creator speaking briskly for a 10-second social media ad, clear articulation';

          try {
            const ai = new GoogleGenAI({
              apiKey,
              apiVersion: 'v1beta',
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash-lite-tts',
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: scriptText,
                      speechMetadata: {
                        style: stylePrompt,
                      },
                    },
                  ],
                },
              ],
              config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                  },
                },
              },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) {
              res.statusCode = 502;
              res.end(JSON.stringify({ error: 'No audio returned by Gemini TTS' }));
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify({
              audioBase64: base64Audio,
              mimeType: 'audio/wav',
            }));
          } catch (err: any) {
            const msg = String(err?.message || 'Gemini TTS failed');
            if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
              res.statusCode = 401;
              res.end(JSON.stringify({
                error: 'API_KEY_INVALID',
                message: 'Bitte gültigen Gemini API-Key in Settings > Secrets hinterlegen.',
              }));
              return;
            }
            res.statusCode = 500;
            res.end(JSON.stringify({ error: msg }));
          }
        });

        server.middlewares.use('/api/export-reel-mp4', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const inputBuf = Buffer.concat(chunks);
          if (!inputBuf.length) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Empty video payload' }));
            return;
          }

          const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const inPath = path.join(os.tmpdir(), `schooly_reel_${id}.webm`);
          const outPath = path.join(os.tmpdir(), `schooly_reel_${id}.mp4`);

          try {
            await fs.writeFile(inPath, inputBuf);
            await execFileAsync('ffmpeg', [
              '-y',
              '-i', inPath,
              '-c:v', 'libx264',
              '-preset', 'fast',
              '-crf', '18',
              '-pix_fmt', 'yuv420p',
              '-r', '30',
              '-c:a', 'aac',
              '-b:a', '192k',
              '-movflags', '+faststart',
              '-t', '10.2',
              outPath,
            ], { timeout: 60000 });

            const mp4Buf = await fs.readFile(outPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="schooly_werbe_reel_10s.mp4"');
            res.end(mp4Buf);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'MP4 conversion failed' }));
          } finally {
            await fs.unlink(inPath).catch(() => {});
            await fs.unlink(outPath).catch(() => {});
          }
        });

        server.middlewares.use('/api/send-welcome', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let rawBody = '';
          for await (const chunk of req) {
            rawBody += chunk;
          }
          let parsedBody = {};
          try {
            parsedBody = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, skipped: true }));
            return;
          }

          try {
            const { default: handler } = await import('./api/send-welcome.js');
            const mockReq = { method: req.method, body: parsedBody };
            const mockRes = {
              status(code) {
                res.statusCode = code;
                return this;
              },
              json(payload) {
                res.end(JSON.stringify(payload));
                return this;
              },
            };
            await handler(mockReq, mockRes);
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Internal error' }));
          }
        });

        server.middlewares.use('/api/instagram-status', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }
          const hasToken = Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_ACCESS_TOKEN.trim());
          const hasPublicUrl = Boolean(process.env.IG_PUBLIC_BASE_URL && process.env.IG_PUBLIC_BASE_URL.trim());
          const hasAdminSecret = Boolean(process.env.SOCIAL_ADMIN_SECRET && process.env.SOCIAL_ADMIN_SECRET.trim());
          res.statusCode = 200;
          res.end(JSON.stringify({
            configured: hasToken,
            blobConfigured: true,
            publicBaseUrlConfigured: hasPublicUrl,
            requiresAdminSecret: hasAdminSecret,
            adminSecretConfigured: hasAdminSecret,
            runtime: 'dev',
            accountHandle: '@schooly.app',
          }));
        });

        server.middlewares.use('/api/ig-temp-media', async (req, res) => {
          const cleanName = (req.url || '').split('?')[0].replace(/^\/+/, '');
          const nameMatch = cleanName.match(/^[a-zA-Z0-9_-]+\.(png|jpe?g)$/);
          if (!nameMatch) {
            res.statusCode = 400;
            res.end('Invalid media filename');
            return;
          }
          const mediaPath = path.join(os.tmpdir(), 'schooly_ig_media', cleanName);
          const contentType = nameMatch[1] === 'png' ? 'image/png' : 'image/jpeg';
          try {
            const buf = await fs.readFile(mediaPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'no-store');
            res.setHeader('Content-Length', String(buf.length));
            if (req.method === 'HEAD') {
              res.end();
              return;
            }
            res.end(buf);
          } catch {
            res.statusCode = 404;
            res.end('Media not found');
          }
        });

        server.middlewares.use('/api/instagram-publish', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          const adminSecret = (process.env.SOCIAL_ADMIN_SECRET || '').trim();
          if (adminSecret) {
            const provided = String(req.headers['x-social-secret'] || '').trim();
            const bufA = Buffer.from(provided, 'utf8');
            const bufB = Buffer.from(adminSecret, 'utf8');
            if (!provided || bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
              res.statusCode = 401;
              res.end(JSON.stringify({
                error: 'UNAUTHORIZED',
                message: 'Falsches oder fehlendes Admin-Passwort (SOCIAL_ADMIN_SECRET).',
              }));
              return;
            }
          }

          let rawBody = '';
          let totalBytes = 0;
          const MAX_BYTES = 50 * 1024 * 1024;
          for await (const chunk of req) {
            const str = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
            totalBytes += Buffer.byteLength(str);
            if (totalBytes > MAX_BYTES) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'Payload too large' }));
              return;
            }
            rawBody += str;
          }

          let body: { action?: string; slide?: string; index?: number; mediaUrls?: string[]; slides?: string[]; caption?: string } = {};
          try {
            body = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          if (body.action === 'verify-secret') {
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          let igUserId = (process.env.IG_USER_ID || '').trim();
          const igAccessToken = (process.env.IG_ACCESS_TOKEN || '').trim();
          if (!igAccessToken) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              error: 'IG_NOT_CONFIGURED',
              message: 'Für automatisches Posten bitte IG_ACCESS_TOKEN (und optional IG_USER_ID) in den Server-Secrets hinterlegen.',
            }));
            return;
          }

          const forwardedProto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
          const hostHeader = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
          const explicitPublicUrl = (process.env.IG_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
          const publicBaseUrl = explicitPublicUrl || (hostHeader ? `${forwardedProto}://${hostHeader}` : '');

          const mediaDir = path.join(os.tmpdir(), 'schooly_ig_media');
          await fs.mkdir(mediaDir, { recursive: true });

          const verifyPublicReachable = async (testUrl: string, tempFileToDeleteOnFail?: string) => {
            try {
              const probeRes = await fetch(testUrl, {
                method: 'HEAD',
                redirect: 'manual',
                signal: AbortSignal.timeout(6000),
              });
              const probeContentType = (probeRes.headers.get('content-type') || '').toLowerCase();
              const probeLocation = probeRes.headers.get('location') || '';
              if (probeRes.status >= 300 && probeRes.status < 400) {
                if (tempFileToDeleteOnFail) await fs.unlink(tempFileToDeleteOnFail).catch(() => {});
                res.statusCode = 400;
                res.end(JSON.stringify({
                  error: 'PUBLIC_MEDIA_AUTH_BLOCKED',
                  message: `Instagram kann die Slides unter ${publicBaseUrl} nicht abrufen, weil die Vorschau durch einen Login geschützt ist (HTTP ${probeRes.status}${probeLocation ? ` → ${probeLocation}` : ''}). Auf Vercel funktioniert das automatisch über Vercel Blob.`,
                }));
                return false;
              }
              if (!probeRes.ok || !probeContentType.startsWith('image/')) {
                if (tempFileToDeleteOnFail) await fs.unlink(tempFileToDeleteOnFail).catch(() => {});
                res.statusCode = 400;
                res.end(JSON.stringify({
                  error: 'PUBLIC_MEDIA_UNREACHABLE',
                  message: `Die Ziel-URL (${publicBaseUrl}) liefert die temporären Bilder nicht öffentlich aus (HTTP ${probeRes.status}, Typ: ${probeContentType || 'unbekannt'}).`,
                }));
                return false;
              }
              return true;
            } catch (probeErr: any) {
              if (tempFileToDeleteOnFail) await fs.unlink(tempFileToDeleteOnFail).catch(() => {});
              res.statusCode = 400;
              res.end(JSON.stringify({
                error: 'PUBLIC_MEDIA_PROBE_FAILED',
                message: `Öffentliche Erreichbarkeit von ${publicBaseUrl} konnte nicht bestätigt werden (${probeErr?.message || 'Netzwerkfehler'}).`,
              }));
              return false;
            }
          };

          // Stage 1: Single slide upload
          if (body.action === 'stage-slide') {
            if (!publicBaseUrl || !/^https:\/\//i.test(publicBaseUrl) || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(publicBaseUrl)) {
              res.statusCode = 400;
              res.end(JSON.stringify({
                error: 'PUBLIC_URL_REQUIRED',
                message: 'Meta Graph API benötigt eine öffentlich erreichbare HTTPS-URL (IG_PUBLIC_BASE_URL) oder ein Vercel-Deployment mit Vercel Blob.',
              }));
              return;
            }
            const match = String(body.slide || '').match(/^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/);
            if (!match) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Ungültiges Bildformat (erwartet JPEG oder PNG).' }));
              return;
            }
            const ext = match[1] === 'png' ? 'png' : 'jpg';
            const idx = Number.isInteger(body.index) ? body.index : 0;
            const filename = `${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const filePath = path.join(mediaDir, filename);
            await fs.writeFile(filePath, Buffer.from(match[2], 'base64'));
            const mediaUrl = `${publicBaseUrl}/api/ig-temp-media/${filename}`;
            const okProbe = await verifyPublicReachable(mediaUrl, filePath);
            if (!okProbe) return;
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, url: mediaUrl }));
            return;
          }

          const rawMediaUrls = Array.isArray(body.mediaUrls) ? body.mediaUrls : [];
          const slides = Array.isArray(body.slides) ? body.slides : [];
          const caption = typeof body.caption === 'string' ? body.caption : '';

          if (!rawMediaUrls.length && (!slides.length || slides.length > 10)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Slides müssen zwischen 1 und 10 Bildern enthalten.' }));
            return;
          }

          if (!rawMediaUrls.length && (!publicBaseUrl || !/^https:\/\//i.test(publicBaseUrl) || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(publicBaseUrl))) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              error: 'PUBLIC_URL_REQUIRED',
              message: 'Meta Graph API benötigt eine öffentlich erreichbare HTTPS-URL (IG_PUBLIC_BASE_URL), um die gerenderten Slides abzurufen. Ohne öffentliche Server-URL nutze bitte „4K PNGs laden“.',
            }));
            return;
          }

          const batchId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const savedPaths: string[] = [];

          let graphBase = igAccessToken.startsWith('IG')
            ? 'https://graph.instagram.com/v21.0'
            : 'https://graph.facebook.com/v21.0';

          const formatMetaError = (errObj: any, fallback: string) => {
            const msg = String(errObj?.message || '');
            const code = Number(errObj?.code);
            if (code === 4 || code === 17 || code === 32 || /request limit/i.test(msg)) {
              return 'Meta Rate-Limit erreicht („Application request limit reached“): Deine Meta-App hat das stündliche Test-Limit kurz überschritten. Bitte ca. 15–60 Minuten warten und dann noch einmal auf „Direkt auf Instagram posten“ klicken (der Beitrag wird nicht doppelt gepostet).';
            }
            return msg || fallback;
          };

          const waitForContainerFinished = async (containerId: string, initialDelayMs = 2500) => {
            if (initialDelayMs > 0) {
              await new Promise((r) => setTimeout(r, initialDelayMs));
            }
            for (let attempt = 0; attempt < 12; attempt++) {
              const statusUrl = `${graphBase}/${encodeURIComponent(containerId)}?fields=status_code,status&access_token=${encodeURIComponent(igAccessToken)}`;
              const statusRes = await fetch(statusUrl);
              const statusJson: any = await statusRes.json().catch(() => ({}));
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
            const mediaUrls: string[] = [];
            if (rawMediaUrls.length > 0) {
              if (rawMediaUrls.length > 10) {
                throw new Error('Maximal 10 Slides pro Beitrag erlaubt.');
              }
              for (const u of rawMediaUrls) {
                const urlStr = String(u || '');
                if (!/^https:\/\//i.test(urlStr)) {
                  throw new Error('Ungültige Medien-URL.');
                }
                mediaUrls.push(urlStr);
                const tempMatch = urlStr.match(/\/api\/ig-temp-media\/([a-zA-Z0-9_-]+\.(?:png|jpe?g))$/);
                if (tempMatch) {
                  savedPaths.push(path.join(mediaDir, tempMatch[1]));
                }
              }
            } else {
              for (let i = 0; i < slides.length; i++) {
                const dataUrl = String(slides[i] || '');
                const match = dataUrl.match(/^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/);
                if (!match) {
                  throw new Error(`Slide ${i + 1} ist kein gültiges JPEG/PNG-Bild.`);
                }
                const ext = match[1] === 'png' ? 'png' : 'jpg';
                const filename = `${batchId}_${i}.${ext}`;
                const filePath = path.join(mediaDir, filename);
                await fs.writeFile(filePath, Buffer.from(match[2], 'base64'));
                savedPaths.push(filePath);
                mediaUrls.push(`${publicBaseUrl}/api/ig-temp-media/${filename}`);
              }
              const okProbe = await verifyPublicReachable(mediaUrls[0]);
              if (!okProbe) return;
            }

            if (!igUserId || igUserId.toLowerCase() === 'me') {
              if (igAccessToken.startsWith('IG')) {
                const meRes = await fetch(`${graphBase}/me?fields=user_id,id,username&access_token=${encodeURIComponent(igAccessToken)}`);
                const meJson: any = await meRes.json().catch(() => ({}));
                igUserId = String(meJson?.user_id || meJson?.id || '').trim();
                if (!igUserId) {
                  throw new Error(formatMetaError(meJson?.error, 'Instagram Konto-ID konnte nicht automatisch aus dem Token ermittelt werden.'));
                }
              } else {
                const accRes = await fetch(`${graphBase}/me/accounts?fields=id,name,instagram_business_account,connected_instagram_account&access_token=${encodeURIComponent(igAccessToken)}`);
                const accJson: any = await accRes.json().catch(() => ({}));
                const pages = Array.isArray(accJson?.data) ? accJson.data : [];
                const foundPage = pages.find((p: any) => p?.instagram_business_account?.id || p?.connected_instagram_account?.id);
                igUserId = String(foundPage?.instagram_business_account?.id || foundPage?.connected_instagram_account?.id || '').trim();

                if (!igUserId) {
                  const fbMeRes = await fetch(`${graphBase}/me?fields=id,name,instagram_business_account,connected_instagram_account&access_token=${encodeURIComponent(igAccessToken)}`);
                  const fbMeJson: any = await fbMeRes.json().catch(() => ({}));
                  igUserId = String(fbMeJson?.instagram_business_account?.id || fbMeJson?.connected_instagram_account?.id || '').trim();
                }

                if (!igUserId) {
                  const igMeRes = await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,id,username&access_token=${encodeURIComponent(igAccessToken)}`);
                  const igMeJson: any = await igMeRes.json().catch(() => ({}));
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
                    const pageNames = pages.map((p: any) => p.name || p.id).filter(Boolean).join(', ');
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
              const j: any = await r.json();
              if (!r.ok || !j?.id) {
                throw new Error(formatMetaError(j?.error, 'Instagram Container konnte nicht erstellt werden.'));
              }
              topCreationId = j.id;
              await waitForContainerFinished(topCreationId, 2500);
            } else {
              const childIds: string[] = [];
              for (let i = 0; i < mediaUrls.length; i++) {
                if (i > 0) await new Promise((r) => setTimeout(r, 180));
                const params = new URLSearchParams({
                  image_url: mediaUrls[i],
                  is_carousel_item: 'true',
                  access_token: igAccessToken,
                });
                const r = await fetch(graphCreateUrl, { method: 'POST', body: params });
                const j: any = await r.json();
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
              const cj: any = await cr.json();
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
            const pubJson: any = await pubRes.json();
            if (!pubRes.ok || !pubJson?.id) {
              throw new Error(formatMetaError(pubJson?.error, 'Veröffentlichung über media_publish fehlgeschlagen.'));
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, id: pubJson.id }));
          } catch (err: any) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: err?.message || 'Instagram-Veröffentlichung fehlgeschlagen.' }));
          } finally {
            for (const p of savedPaths) {
              await fs.unlink(p).catch(() => {});
            }
          }
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: false,
  },
});
