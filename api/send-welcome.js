export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email fehlt' });
    }

    const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#07070f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);border-radius:24px;padding:36px 32px;text-align:center;margin-bottom:16px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40px;left:-20px;width:160px;height:160px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
      <div style="position:absolute;bottom:-60px;right:-20px;width:200px;height:200px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
      <div style="position:relative;z-index:1;">
        <div style="font-size:36px;margin-bottom:8px;">🎓</div>
        <h1 style="margin:0;font-size:26px;font-weight:900;color:white;letter-spacing:-0.5px;">SchoolFlow</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Gymnasiale Oberstufe</p>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background:rgba(255,255,255,0.055);border:1px solid rgba(255,255,255,0.13);border-radius:24px;padding:32px;margin-bottom:16px;">
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#f1f5f9;">Hey ${name}! 👋</h2>
      <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
        Willkommen bei SchoolFlow — du bist jetzt dabei. Dein Account ist eingerichtet und bereit. Hier ist alles was auf dich wartet:
      </p>

      <!-- Features -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;">

        <div style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;">
          <div style="font-size:22px;flex-shrink:0;">📊</div>
          <div>
            <div style="color:#c7d2fe;font-weight:800;font-size:14px;margin-bottom:2px;">Notenverwaltung</div>
            <div style="color:#64748b;font-size:13px;line-height:1.4;">Trag deine Noten ein und behalte deinen Schnitt immer im Blick.</div>
          </div>
        </div>

        <div style="background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;">
          <div style="font-size:22px;flex-shrink:0;">📅</div>
          <div>
            <div style="color:#ddd6fe;font-weight:800;font-size:14px;margin-bottom:2px;">Planer & Kalender</div>
            <div style="color:#64748b;font-size:13px;line-height:1.4;">Klausuren, Tests und Aufgaben — alles an einem Ort.</div>
          </div>
        </div>

        <div style="background:rgba(56,189,248,0.10);border:1px solid rgba(56,189,248,0.2);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;">
          <div style="font-size:22px;flex-shrink:0;">🎯</div>
          <div>
            <div style="color:#bae6fd;font-weight:800;font-size:14px;margin-bottom:2px;">Abitur-Übersicht</div>
            <div style="color:#64748b;font-size:13px;line-height:1.4;">Simuliere deine Abiturnote und plane gezielt für die Prüfungen.</div>
          </div>
        </div>

      </div>

      <!-- Motivationstext -->
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;margin-bottom:28px;text-align:center;">
        <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.7;font-style:italic;">
          „Die Oberstufe ist ein Marathon, kein Sprint. Mit den richtigen Tools bleibst du auf Kurs." 💪
        </p>
      </div>

      <!-- CTA Button -->
      <a href="https://schoolflow26.vercel.app" style="display:block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;text-align:center;padding:18px;border-radius:50px;font-weight:900;font-size:15px;letter-spacing:0.5px;box-shadow:0 8px 24px rgba(99,102,241,0.4);">
        Jetzt loslegen →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:0 0 40px;">
      <p style="margin:0;color:#334155;font-size:12px;line-height:1.6;">
        SchoolFlow · Diese Mail wurde automatisch verschickt<br>
        <span style="color:#1e293b;">Du erhältst diese Mail weil du dich gerade registriert hast.</span>
      </p>
    </div>

  </div>
</body>
</html>`;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: email,
                subject: `Hey ${name}, willkommen bei SchoolFlow! 🎓`,
                html
            })
        });

        if (!response.ok) {
            const err = await response.json();
            return res.status(500).json({ error: err });
        }

        return res.status(200).json({ ok: true });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
