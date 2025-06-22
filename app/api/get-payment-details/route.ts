import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

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
      const supabase = createSupabaseServerClient();

      // Check if we have already processed this payment
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();

      if (!existingPayment) {
        const lineItem = session.line_items?.data[0];
        const productName = (lineItem?.price?.product as Stripe.Product)?.name || 'Unknown Product';
        
        const { error } = await supabase.from('payments').insert({
          stripe_session_id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
          product_name: productName,
          payment_status: session.payment_status,
        });

        if (error) {
          console.error('Error saving payment to database:', error);
          // We don't want to block the user, so we'll just log the error
        }
      }
    }

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 