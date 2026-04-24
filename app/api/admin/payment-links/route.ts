import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  createPaymentLinkRecord,
  ensurePaymentLinkSchema,
  listPaymentLinks,
  setPaymentLinkStatus,
  type PaymentAmountMode,
  type PaymentTrainingTable,
} from '@/app/lib/db/paymentLinkRepository';
import { getCatalogRecordById } from '@/app/lib/db/catalogRepository';
import { serverLogger } from '@/app/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

function parsePositiveAmount(value: unknown) {
  const parsed = Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100) / 100;
}

function isTrainingTable(value: string): value is PaymentTrainingTable {
  return value === 'technical_trainings' || value === 'non_technical_trainings';
}

function isAmountMode(value: string): value is PaymentAmountMode {
  return value === 'total' || value === 'per_head';
}

export async function GET(request: NextRequest) {
  try {
    await ensurePaymentLinkSchema();
    const { searchParams } = new URL(request.url);
    const data = await listPaymentLinks({
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
    });
    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('Payment links GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch payment links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensurePaymentLinkSchema();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing Stripe configuration' }, { status: 500 });
    }

    const body = await request.json();
    const trainingTable = String(body.training_table || '').trim();
    const trainingId = String(body.training_id || '').trim();
    const amountMode = String(body.amount_mode || '').trim();
    const amount = parsePositiveAmount(body.amount_myr);
    const customerName = String(body.customer_name || '').trim();
    const companyName = String(body.company_name || '').trim();
    const customerEmail = String(body.customer_email || '').trim();
    const notes = String(body.notes || '').trim();

    if (!isTrainingTable(trainingTable)) {
      return NextResponse.json(
        { error: 'training_table must be technical_trainings or non_technical_trainings' },
        { status: 400 }
      );
    }

    if (!trainingId) {
      return NextResponse.json({ error: 'training_id is required' }, { status: 400 });
    }

    if (!isAmountMode(amountMode)) {
      return NextResponse.json({ error: 'amount_mode must be total or per_head' }, { status: 400 });
    }

    if (!amount) {
      return NextResponse.json({ error: 'amount_myr must be a positive number' }, { status: 400 });
    }

    if (!customerName && !companyName) {
      return NextResponse.json(
        { error: 'Provide at least customer_name or company_name' },
        { status: 400 }
      );
    }

    const trainingLookup = await getCatalogRecordById(trainingTable, trainingId);
    const training = trainingLookup.data as { title?: string } | null;
    if (!training?.title) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }

    const amountInSen = Math.round(amount * 100);
    const linkLabelPrefix = amountMode === 'per_head' ? 'Per Head' : 'Total';
    const payerLabel = companyName || customerName || 'Customer';
    const trainingTitle = String(training.title);
    const paymentTitle = `${trainingTitle} - ${linkLabelPrefix} Payment`;

    const product = await stripe.products.create({
      name: paymentTitle,
      description: `Training payment for ${payerLabel}`,
      metadata: {
        training_table: trainingTable,
        training_id: trainingId,
        amount_mode: amountMode,
        customer_name: customerName,
        company_name: companyName,
      },
    });

    const price = await stripe.prices.create({
      currency: 'myr',
      unit_amount: amountInSen,
      product: product.id,
      metadata: {
        training_table: trainingTable,
        training_id: trainingId,
        amount_mode: amountMode,
      },
    });

    const lineItems =
      amountMode === 'per_head'
        ? [
            {
              price: price.id,
              quantity: 1,
              adjustable_quantity: { enabled: true, minimum: 1, maximum: 250 },
            },
          ]
        : [{ price: price.id, quantity: 1 }];

    const paymentLink = await stripe.paymentLinks.create({
      line_items: lineItems,
      metadata: {
        training_table: trainingTable,
        training_id: trainingId,
        amount_mode: amountMode,
        customer_name: customerName,
        company_name: companyName,
        customer_email: customerEmail,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success`,
        },
      },
    });

    const data = await createPaymentLinkRecord({
      training_table: trainingTable,
      training_id: trainingId,
      training_title: trainingTitle,
      amount_mode: amountMode,
      amount_myr: amount,
      stripe_product_id: product.id,
      stripe_price_id: price.id,
      stripe_payment_link_id: paymentLink.id,
      payment_link_url: paymentLink.url,
      customer_name: customerName || null,
      company_name: companyName || null,
      customer_email: customerEmail || null,
      notes: notes || null,
      status: true,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    serverLogger.error('Payment links POST error:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensurePaymentLinkSchema();
    const body = await request.json();
    const id = String(body.id || '').trim();
    const status = typeof body.status === 'boolean' ? body.status : null;
    if (!id || status === null) {
      return NextResponse.json({ error: 'id and boolean status are required' }, { status: 400 });
    }

    const data = await setPaymentLinkStatus(id, status);
    if (!data) {
      return NextResponse.json({ error: 'Payment link not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('Payment links PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update payment link status' }, { status: 500 });
  }
}
