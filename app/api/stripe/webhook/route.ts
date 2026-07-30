import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: any;
  if (webhookSecret === 'whsec_placeholder') {
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

  const tierFromPriceId: Record<string, string> = {
    [process.env.STRIPE_PRICE_FOUNDATION!]:  'foundation',
    [process.env.STRIPE_PRICE_ACCELERATOR!]: 'accelerator',
    [process.env.STRIPE_PRICE_PINNACLE!]:    'pinnacle',
  };

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId  = session.metadata?.userId;
      const tier    = session.metadata?.tier;
      if (userId && tier) {
        await sql`UPDATE users SET tier = ${tier} WHERE id = ${userId}`;
        console.log(`[Stripe] Upgraded user ${userId} to ${tier}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub     = event.data.object;
      const userId  = sub.metadata?.userId;
      const priceId = sub.items?.data?.[0]?.price?.id;
      const tier    = priceId ? tierFromPriceId[priceId] : null;
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
        await sql`UPDATE users SET tier = 'foundation' WHERE id = ${userId}`;
        console.log(`[Stripe] Downgraded user ${userId} to foundation`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
