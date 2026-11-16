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
