import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, PRICE_IDS, ONE_TIME_PRICE_IDS } from '@/lib/stripe';
import { SUBSCRIBABLE_TIERS, EXTRA_AUDIT_MAX_QTY, getExtraAuditPrice, Tier } from '@/lib/tiers';
import sql from '@/lib/db';

// POST body, one of:
//   { tier: 'foundation' | ... | 'consultant100' }        → monthly subscription
//   { product: 'single_report' }                           → one audit credit ($199)
//   { product: 'extra_audit', quantity: n }                → n audit credits (Enterprise / Consultant 100 only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user.id as string;
    const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
    const user = rows[0] as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    user.email,
        name:     user.name,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;
      await sql`UPDATE users SET stripe_customer_id = ${customerId} WHERE id = ${user.id}`;
    }

    const baseUrl = process.env.AUTH_URL || 'http://localhost:3000';

    // ── One-time credit purchases ──────────────────────────────────────────
    if (body.product) {
      let priceId = '';
      let quantity = 1;
      const kind = String(body.product);

      if (kind === 'single_report') {
        priceId = ONE_TIME_PRICE_IDS.single_report;
      } else if (kind === 'extra_audit') {
        if (!getExtraAuditPrice(user.tier)) {
          return NextResponse.json(
            { error: 'Additional audits are available on the Enterprise and Consultant 100 plans.' },
            { status: 403 },
          );
        }
        priceId = user.tier === 'pinnacle'
          ? ONE_TIME_PRICE_IDS.extra_audit_pinnacle
          : ONE_TIME_PRICE_IDS.extra_audit_consultant100;
        quantity = Math.floor(Number(body.quantity));
        if (!Number.isFinite(quantity) || quantity < 1 || quantity > EXTRA_AUDIT_MAX_QTY) {
          return NextResponse.json(
            { error: `Choose between 1 and ${EXTRA_AUDIT_MAX_QTY} additional audits.` },
            { status: 400 },
          );
        }
      } else {
        return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
      }

      if (!priceId) {
        return NextResponse.json({ error: 'This product is not available yet.' }, { status: 503 });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        line_items: [{ price: priceId, quantity }],
        success_url: `${baseUrl}/dashboard?purchase=success`,
        cancel_url:  `${baseUrl}/dashboard?purchase=cancelled`,
        metadata: { userId: String(user.id), kind, credits: String(quantity) },
        payment_intent_data: {
          metadata: { userId: String(user.id), kind, credits: String(quantity) },
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    }

    // ── Subscriptions ──────────────────────────────────────────────────────
    const tier = String(body.tier) as Tier;
    const priceId = SUBSCRIBABLE_TIERS.includes(tier) ? PRICE_IDS[tier] : '';
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier.' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/pricing?success=true&tier=${tier}`,
      cancel_url:  `${baseUrl}/pricing?cancelled=true`,
      metadata: { userId: String(user.id), tier },
      subscription_data: {
        metadata: { userId: String(user.id), tier },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (err: any) {
    console.error('[Stripe Checkout Error]', err);
    return NextResponse.json(
      { error: err.message || 'Checkout failed.' },
      { status: 500 }
    );
  }
}
