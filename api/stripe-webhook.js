import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const body = req.body;
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const email = paymentIntent.receipt_email;
    const amount = paymentIntent.amount / 100; // Convert cents to EUR
    const eventId = 'stripe_' + paymentIntent.id;

    // Send to Meta CAPI
    try {
      await fetch(`https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            event_name: 'Purchase',
            event_id: eventId,
            event_source_url: 'https://nexlify.com/thank-you',
            user_data: {
              em: email ? crypto.createHash('sha256').update(email.toLowerCase()).digest('hex') : null,
              client_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              client_user_agent: req.headers['user-agent']
            },
            custom_data: {
              value: amount,
              currency: 'EUR',
              content_name: 'Nexlify Product',
              content_type: 'product'
            }
          }],
          test_event_code: process.env.META_TEST_EVENT_CODE
        })
      });
    } catch (metaError) {
      console.error('Meta CAPI error:', metaError);
    }
  }

  return res.status(200).json({ received: true });
}
