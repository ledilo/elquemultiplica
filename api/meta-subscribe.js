// /api/meta-subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const PIXEL_ID = "1862917477977535"; // tu pixel
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN; // guardalo en Vercel Settings → Environment Variables

    const { event_id, fbp, fbc } = req.body || {};

    const payload = {
      data: [{
        event_name: 'Subscribe',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id,
        user_data: {
          fbp,
          fbc
        }
      }]
    };

    const fbRes = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await fbRes.json();
    if (!fbRes.ok) return res.status(400).json({ error: json });
    return res.status(200).json({ ok: true, fb: json });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
