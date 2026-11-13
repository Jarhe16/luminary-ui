import { NextRequest, NextResponse } from 'next/server';
import { stripe, tierFromPriceId } from '@/lib/stripe';
import { SUBSCRIBABLE_TIERS, Tier } from '@/lib/tiers';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: any;
  if (webhookSecret === 'whsec_placeholder' || !webhookSecret) {
    // Unsigned events are accepted only on a local dev server, never on Vercel.
    if (process.env.NODE_ENV !== 'development') {
      console.error('[Stripe] STRIPE_WEBHOOK_SECRET is missing or a placeholder; refusing unsigned webhook.');
      return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
    }
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
    }
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId  = session.metadata?.userId;
      if (!userId) break;

      if (session.mode === 'payment') {
        // One-time purchase → add audit credits (never changes the plan)
        if (session.payment_status !== 'paid') break;
        const credits = Math.floor(Number(session.metadata?.credits));
        const kind    = String(session.metadata?.kind ?? 'unknown');
        if (!Number.isFinite(credits) || credits < 1) break;

        const inserted = await sql`
          INSERT INTO credit_purchases (stripe_session_id, user_id, kind, credits, amount_cents)
          VALUES (${session.id}, ${userId}, ${kind}, ${credits}, ${session.amount_total ?? null})
          ON CONFLICT (stripe_session_id) DO NOTHING
          RETURNING id
        `;
        if (inserted.length > 0) {
          await sql`UPDATE users SET audit_credits = audit_credits + ${credits} WHERE id = ${userId}`;
          console.log(`[Stripe] Added ${credits} audit credit(s) to user ${userId} (${kind})`);
        }
        break;
      }

      // Subscription checkout → set the plan
      const tier = session.metadata?.tier as Tier | undefined;
      if (tier && SUBSCRIBABLE_TIERS.includes(tier)) {
        await sql`UPDATE users SET tier = ${tier} WHERE id = ${userId}`;
        console.log(`[Stripe] Upgraded user ${userId} to ${tier}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub     = event.data.object;
      const userId  = sub.metadata?.userId;
      const tier    = tierFromPriceId(sub.items?.data?.[0]?.price?.id);
      if (userId && tier) {
        await sql`UPDATE users SET tier = ${tier} WHERE id = ${userId}`;
        console.log(`[Stripe] Updated user ${userId} to ${tier}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub    = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        await sql`UPDATE users SET tier = 'inactive' WHERE id = ${userId}`;
        console.log(`[Stripe] Subscription ended for user ${userId}; tier set to inactive`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
