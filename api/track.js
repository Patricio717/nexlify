import crypto from 'crypto';

function hashValue(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).toLowerCase().trim()).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    eventName,
    eventId,
    eventSourceUrl,
    email,
    value,
    currency,
    contentIds,
    contentName
  } = req.body;

  if (!eventName || !eventId) {
    return res.status(400).json({ error: 'eventName and eventId are required' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            event_name: eventName,
            event_id: eventId,
            event_source_url: eventSourceUrl || 'https://nexlify.com',
            user_data: {
              em: hashValue(email),
              client_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              client_user_agent: req.headers['user-agent']
            },
            custom_data: value ? {
              value: value,
              currency: currency || 'EUR',
              content_ids: contentIds || ['nexlify'],
              content_name: contentName || 'Nexlify Product',
              content_type: 'product'
            } : {}
          }],
          test_event_code: process.env.META_TEST_EVENT_CODE
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta API error:', data);
      return res.status(400).json({ error: 'Failed to track event', details: data });
    }

    return res.status(200).json({ ok: true, events_received: data.events_received });
  } catch (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ error: error.message });
  }
}
