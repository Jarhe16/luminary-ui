import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, PRICE_IDS } from '@/lib/stripe';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = body;
    const priceId = PRICE_IDS[tier];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier.' }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM users WHERE id = ${session.user.id}`;
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/pricing?success=true&tier=${tier}`,
      cancel_url:  `${baseUrl}/pricing?cancelled=true`,
      metadata: { userId: String(session.user.id), tier },
      subscription_data: {
        metadata: { userId: String(session.user.id), tier },
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
