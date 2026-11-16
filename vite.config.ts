import { defineConfig } from 'vite';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
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
          const hasUserId = Boolean(process.env.IG_USER_ID && process.env.IG_USER_ID.trim());
          const hasToken = Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_ACCESS_TOKEN.trim());
          const hasPublicUrl = Boolean(process.env.IG_PUBLIC_BASE_URL && process.env.IG_PUBLIC_BASE_URL.trim());
          res.statusCode = 200;
          res.end(JSON.stringify({
            configured: hasUserId && hasToken,
            publicBaseUrlConfigured: hasPublicUrl,
            accountHandle: '@schooly.app',
          }));
        });

        server.middlewares.use('/api/ig-temp-media', async (req, res) => {
          const cleanName = (req.url || '').split('?')[0].replace(/^\/+/, '');
          if (!/^[a-zA-Z0-9_-]+\.png$/.test(cleanName)) {
            res.statusCode = 400;
            res.end('Invalid media filename');
            return;
          }
          const mediaPath = path.join(os.tmpdir(), 'schooly_ig_media', cleanName);
          try {
            const buf = await fs.readFile(mediaPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/png');
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

          const igUserId = (process.env.IG_USER_ID || '').trim();
          const igAccessToken = (process.env.IG_ACCESS_TOKEN || '').trim();
          if (!igUserId || !igAccessToken) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              error: 'IG_NOT_CONFIGURED',
              message: 'Für automatisches Posten bitte IG_USER_ID und IG_ACCESS_TOKEN (Instagram Business + Meta Graph API) in den Server-Secrets hinterlegen.',
            }));
            return;
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

          let body: { slides?: string[]; caption?: string } = {};
          try {
            body = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const slides = Array.isArray(body.slides) ? body.slides : [];
          const caption = typeof body.caption === 'string' ? body.caption : '';
          if (!slides.length || slides.length > 10) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Slides müssen zwischen 1 und 10 Bildern enthalten.' }));
            return;
          }

          const forwardedProto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
          const hostHeader = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
          const publicBaseUrl = (process.env.IG_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '') || (hostHeader ? `${forwardedProto}://${hostHeader}` : '');

          if (!publicBaseUrl || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(publicBaseUrl)) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              error: 'PUBLIC_URL_REQUIRED',
              message: 'Meta Graph API benötigt eine öffentlich erreichbare HTTPS-URL (IG_PUBLIC_BASE_URL), um die gerenderten Slides abzurufen.',
            }));
            return;
          }

          const mediaDir = path.join(os.tmpdir(), 'schooly_ig_media');
          await fs.mkdir(mediaDir, { recursive: true });
          const batchId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const savedPaths: string[] = [];

          const waitForContainerFinished = async (containerId: string) => {
            for (let attempt = 0; attempt < 15; attempt++) {
              const statusUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(containerId)}?fields=status_code&access_token=${encodeURIComponent(igAccessToken)}`;
              const statusRes = await fetch(statusUrl);
              const statusJson: any = await statusRes.json().catch(() => ({}));
              const code = statusJson?.status_code;
              if (code === 'FINISHED' || code === 'PUBLISHED') return;
              if (code === 'ERROR' || code === 'EXPIRED') {
                throw new Error(`Instagram Medien-Container Status: ${code}`);
              }
              await new Promise((r) => setTimeout(r, 1000));
            }
          };

          try {
            const mediaUrls: string[] = [];
            for (let i = 0; i < slides.length; i++) {
              const dataUrl = String(slides[i] || '');
              const match = dataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
              if (!match) {
                throw new Error(`Slide ${i + 1} ist kein gültiges PNG-Bild.`);
              }
              const filename = `${batchId}_${i}.png`;
              const filePath = path.join(mediaDir, filename);
              await fs.writeFile(filePath, Buffer.from(match[1], 'base64'));
              savedPaths.push(filePath);
              mediaUrls.push(`${publicBaseUrl}/api/ig-temp-media/${filename}`);
            }

            const graphCreateUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}/media`;
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
                throw new Error(j?.error?.message || 'Instagram Container konnte nicht erstellt werden.');
              }
              topCreationId = j.id;
            } else {
              const childIds: string[] = [];
              for (const imageUrl of mediaUrls) {
                const params = new URLSearchParams({
                  image_url: imageUrl,
                  is_carousel_item: 'true',
                  access_token: igAccessToken,
                });
                const r = await fetch(graphCreateUrl, { method: 'POST', body: params });
                const j: any = await r.json();
                if (!r.ok || !j?.id) {
                  throw new Error(j?.error?.message || 'Carousel-Slide konnte nicht hochgeladen werden.');
                }
                childIds.push(j.id);
              }
              for (const childId of childIds) {
                await waitForContainerFinished(childId);
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
                throw new Error(cj?.error?.message || 'Instagram Carousel-Container fehlgeschlagen.');
              }
              topCreationId = cj.id;
            }

            await waitForContainerFinished(topCreationId);

            const publishParams = new URLSearchParams({
              creation_id: topCreationId,
              access_token: igAccessToken,
            });
            const pubRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}/media_publish`, {
              method: 'POST',
              body: publishParams,
            });
            const pubJson: any = await pubRes.json();
            if (!pubRes.ok || !pubJson?.id) {
              throw new Error(pubJson?.error?.message || 'Veröffentlichung über media_publish fehlgeschlagen.');
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
