export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email fehlt' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'RESEND_API_KEY nicht gesetzt' });
    }

    const payload = {
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Hey ${name}, willkommen bei SchoolFlow! 🎓`,
        html: `<h2>Hey ${name}!</h2><p>Willkommen bei SchoolFlow 🎓</p>`
    };

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(500).json({ 
            resend_status: response.status,
            resend_error: data,
            key_prefix: apiKey.substring(0, 8)
        });
    }

    return res.status(200).json({ ok: true, id: data.id });
}
