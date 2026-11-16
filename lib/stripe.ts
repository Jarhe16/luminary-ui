import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY!;

export const stripe = new Stripe(secretKey, {
  apiVersion: '2026-07-29.dahlia',
});

// Sandbox (test-mode) price IDs. Used only when running on a test key and the
// matching env var is not set. Live keys always require the env vars.
const isLive = (secretKey ?? '').startsWith('sk_live') || (secretKey ?? '').startsWith('rk_live');
const sandbox = (id: string) => (isLive ? '' : id);

export const PRICE_IDS: Record<string, string> = {
  foundation:    process.env.STRIPE_PRICE_FOUNDATION!,
  accelerator:   process.env.STRIPE_PRICE_ACCELERATOR!,
  pinnacle:      process.env.STRIPE_PRICE_PINNACLE!,
  consultant25:  process.env.STRIPE_PRICE_CONSULTANT25  || sandbox('price_1UbRaDJz868FFb6cTolaMSMz'),
  consultant50:  process.env.STRIPE_PRICE_CONSULTANT50  || sandbox('price_1UbRc4Jz868FFb6cMTyV8Dsp'),
  consultant100: process.env.STRIPE_PRICE_CONSULTANT100 || sandbox('price_1UbRcwJz868FFb6cAmQ6aTXs'),
};

// One-time products
export const ONE_TIME_PRICE_IDS = {
  single_report:            process.env.STRIPE_PRICE_SINGLE_REPORT              || sandbox('price_1UbRklJz868FFb6cVxgueZYL'),
  extra_audit_pinnacle:     process.env.STRIPE_PRICE_EXTRA_AUDIT_ENTERPRISE     || sandbox('price_1UbRmdJz868FFb6cQVMhsTwX'),
  extra_audit_consultant100: process.env.STRIPE_PRICE_EXTRA_AUDIT_CONSULTANT100 || sandbox('price_1UbRnbJz868FFb6cDK233bbO'),
};

// Safety switch: the live site must not take payments through a sandbox (test) key —
// real cards would be declined and Stripe's public test cards would unlock plans for free.
// Turns off by itself once production has a live key.
export const SUPPORT_EMAIL = 'hello@luminaryfinancial.co';
export const CHECKOUT_PAUSED = process.env.VERCEL_ENV === 'production' && !isLive;
export const CHECKOUT_PAUSED_MESSAGE =
  `Online checkout opens shortly. Email us at ${SUPPORT_EMAIL} and we'll activate your plan today.`;

export function tierFromPriceId(priceId: string | undefined | null): string | null {
  if (!priceId) return null;
  for (const [tier, id] of Object.entries(PRICE_IDS)) {
    if (id && id === priceId) return tier;
  }
  return null;
}
