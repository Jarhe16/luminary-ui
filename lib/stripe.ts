import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

export const PRICE_IDS: Record<string, string> = {
  foundation:  process.env.STRIPE_PRICE_FOUNDATION!,
  accelerator: process.env.STRIPE_PRICE_ACCELERATOR!,
  pinnacle:    process.env.STRIPE_PRICE_PINNACLE!,
};
