export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email fehlt' });
    }

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
                subject: 'Willkommen bei SchoolFlow! 🎓',
                html: `
                    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: auto; background: #07070f; color: #f1f5f9; padding: 40px 32px; border-radius: 24px;">
                        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: white;">SchoolFlow</h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">Gymnasiale Oberstufe</p>
                        </div>
                        <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 12px;">Hey ${name}! 👋</h2>
                        <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 24px;">
                            Willkommen bei SchoolFlow — dein smarter Begleiter durch die Oberstufe ist jetzt bereit.
                        </p>
                        <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 32px;">
                            Trag deine Fächer ein, behalte deine Noten im Blick und plane deine Aufgaben. Viel Erfolg! 💪
                        </p>
                        <a href="https://schoolflow26.vercel.app" style="display: block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; text-align: center; padding: 16px; border-radius: 50px; font-weight: 800; font-size: 15px;">
                            Zur App →
                        </a>
                        <p style="color: #475569; font-size: 12px; text-align: center; margin-top: 32px;">
                            SchoolFlow · Diese Mail wurde automatisch verschickt
                        </p>
                    </div>
                `
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
