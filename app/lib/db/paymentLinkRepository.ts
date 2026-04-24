import { runNeonQuery } from '@/app/lib/db/neon';

export type PaymentTrainingTable = 'technical_trainings' | 'non_technical_trainings';
export type PaymentAmountMode = 'total' | 'per_head';

export interface PaymentLinkRecord {
  id: string;
  training_table: PaymentTrainingTable;
  training_id: string;
  training_title: string;
  amount_mode: PaymentAmountMode;
  amount_myr: number;
  stripe_product_id: string;
  stripe_price_id: string;
  stripe_payment_link_id: string;
  payment_link_url: string;
  customer_name: string | null;
  company_name: string | null;
  customer_email: string | null;
  notes: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

let paymentLinkSchemaReady = false;

export async function ensurePaymentLinkSchema() {
  if (paymentLinkSchemaReady) return;

  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS payment_links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      training_table TEXT NOT NULL CHECK (training_table IN ('technical_trainings', 'non_technical_trainings')),
      training_id UUID NOT NULL,
      training_title TEXT NOT NULL,
      amount_mode TEXT NOT NULL CHECK (amount_mode IN ('total', 'per_head')),
      amount_myr NUMERIC(12, 2) NOT NULL CHECK (amount_myr > 0),
      stripe_product_id TEXT NOT NULL,
      stripe_price_id TEXT NOT NULL,
      stripe_payment_link_id TEXT NOT NULL UNIQUE,
      payment_link_url TEXT NOT NULL UNIQUE,
      customer_name TEXT,
      company_name TEXT,
      customer_email TEXT,
      notes TEXT,
      status BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_payment_links_training
      ON payment_links (training_table, training_id)
  `);
  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_payment_links_status_created
      ON payment_links (status, created_at DESC)
  `);

  paymentLinkSchemaReady = true;
}

export async function createPaymentLinkRecord(
  payload: Omit<PaymentLinkRecord, 'id' | 'created_at' | 'updated_at'>
) {
  await ensurePaymentLinkSchema();

  const result = await runNeonQuery<PaymentLinkRecord>(
    `
    INSERT INTO payment_links (
      training_table,
      training_id,
      training_title,
      amount_mode,
      amount_myr,
      stripe_product_id,
      stripe_price_id,
      stripe_payment_link_id,
      payment_link_url,
      customer_name,
      company_name,
      customer_email,
      notes,
      status
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14
    )
    RETURNING *
    `,
    [
      payload.training_table,
      payload.training_id,
      payload.training_title,
      payload.amount_mode,
      payload.amount_myr,
      payload.stripe_product_id,
      payload.stripe_price_id,
      payload.stripe_payment_link_id,
      payload.payment_link_url,
      payload.customer_name ?? null,
      payload.company_name ?? null,
      payload.customer_email ?? null,
      payload.notes ?? null,
      payload.status,
    ]
  );

  return result.rows[0];
}

export async function listPaymentLinks(params: {
  status?: string | null;
  search?: string | null;
  limit?: string | null;
}) {
  await ensurePaymentLinkSchema();

  const values: unknown[] = [];
  const where: string[] = [];
  let sql = 'SELECT * FROM payment_links';

  if (params.status !== null && params.status !== undefined) {
    values.push(params.status === 'true');
    where.push(`status = $${values.length}`);
  }

  if (params.search) {
    values.push(`%${params.search}%`);
    where.push(
      `(training_title ILIKE $${values.length} OR COALESCE(customer_name, '') ILIKE $${values.length} OR COALESCE(company_name, '') ILIKE $${values.length})`
    );
  }

  if (where.length > 0) {
    sql += ` WHERE ${where.join(' AND ')}`;
  }

  sql += ' ORDER BY created_at DESC';

  if (params.limit) {
    const parsedLimit = Number.parseInt(params.limit, 10);
    if (!Number.isNaN(parsedLimit)) {
      values.push(parsedLimit);
      sql += ` LIMIT $${values.length}`;
    }
  }

  const result = await runNeonQuery<PaymentLinkRecord>(sql, values);
  return result.rows;
}

export async function setPaymentLinkStatus(id: string, status: boolean) {
  await ensurePaymentLinkSchema();
  const result = await runNeonQuery<PaymentLinkRecord>(
    `
    UPDATE payment_links
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );
  return result.rows[0] ?? null;
}
