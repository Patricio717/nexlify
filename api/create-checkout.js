export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 3700, // €37.00 in cents
      currency: 'eur',
      metadata: {
        product: 'nexlify',
        source: 'landing_page'
      },
      description: 'Nexlify Digital Product',
      receipt_email: email
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: 3700
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
