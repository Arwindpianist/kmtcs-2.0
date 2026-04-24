import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { runNeonQuery } from '@/app/lib/db/neon';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

let paymentsTableReady = false;

async function ensurePaymentsTable() {
  if (paymentsTableReady) return;

  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      stripe_session_id TEXT NOT NULL UNIQUE,
      amount_total INTEGER,
      currency TEXT,
      customer_email TEXT,
      product_name TEXT,
      payment_status TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  paymentsTableReady = true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items.data.price.product'],
    });

    // If payment was successful, save details to our database
    if (session.payment_status === 'paid') {
      const lineItem = session.line_items?.data[0];
      const productName = (lineItem?.price?.product as Stripe.Product)?.name || 'Unknown Product';

      try {
        await ensurePaymentsTable();
        await runNeonQuery(
          `
          INSERT INTO payments (
            stripe_session_id,
            amount_total,
            currency,
            customer_email,
            product_name,
            payment_status
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (stripe_session_id) DO NOTHING
          `,
          [
            session.id,
            session.amount_total,
            session.currency,
            session.customer_details?.email ?? null,
            productName,
            session.payment_status,
          ]
        );
      } catch (dbError) {
        console.error('Error saving payment to Neon:', dbError);
        // Continue response to avoid blocking paid users.
      }
    }

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 