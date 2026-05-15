# Nexlify Project Documentation

## Product Details
- **Product Name:** Nexlify
- **Domain:** nexlify.com
- **Price:** €37 EUR
- **Primary Market:** EU

## Architecture

### Frontend (Public)
- **index.html** — Landing page with pricing section
- **checkout.html** — Stripe payment form
- **thank-you.html** — Post-purchase confirmation
- **privacy.html**, **terms.html**, **refund.html** — Legal pages
- **tracking.js** — Meta Pixel events (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
- **posthog-init.js** — PostHog analytics initialization

### API (Serverless on Vercel)
- **api/create-checkout.js** — Creates Stripe PaymentIntent
- **api/stripe-webhook.js** — Handles Stripe webhooks, sends Purchase event to Meta CAPI
- **api/track.js** — Server-side Meta CAPI endpoint for event tracking

### Configuration
- **vercel.json** — Vercel routing and deployment config
- **package.json** — Dependencies (Stripe SDK)
- **.gitignore** — Excludes .env files and node_modules

## Environment Variables (Vercel)

These must be added via `vercel env add` (never committed):
- `STRIPE_SECRET_KEY` — Live Stripe secret key (sk_live_...)
- `STRIPE_PUBLISHABLE_KEY` — Live Stripe publishable key (pk_live_...)
- `STRIPE_WEBHOOK_SECRET` — Webhook signing secret from Stripe dashboard
- `META_PIXEL_ID` — 16-digit Meta Pixel ID
- `META_ACCESS_TOKEN` — Meta Conversions API access token (EAA...)
- `META_TEST_EVENT_CODE` — Test event code for Meta (used during testing)

## Deployment

```bash
cd ~/Documents/nexlify
vercel --prod --yes
```

Verify the live URL and take a screenshot.

## Important Rules

1. **Never commit .env files** — use `vercel env add` for secrets
2. **Announce DNS changes before applying** — especially domain adds
3. **Event deduplication** — browser and webhook events must share the same `event_id` format (stripe_<paymentIntent.id>)
4. **Test checkout with real $1 payment** — then refund immediately from Stripe dashboard
5. **Verify tracking in Meta Events Manager Test Events tab** — NOT Overview (delayed)

## Tracking Flow

1. **Browser fires** Meta Pixel event with deterministic eventID
2. **Server receives** webhook from Stripe
3. **Server fires** Meta CAPI event with same eventID
4. **Meta deduplicates** into single conversion

## Next Steps

- Phase 3: Vercel link + deploy
- Phase 4: Domain DNS → Vercel
- Phase 5: Stripe checkout setup
- Phase 6-7: Meta Pixel + CAPI
- Phase 8-9: PostHog analytics
- Phase 10: Pipeboard for ads

---

**Last Updated:** May 2026
