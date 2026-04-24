import { createHash, randomBytes } from 'node:crypto';
import { runNeonQuery } from '@/app/lib/db/neon';

const RESET_TOKEN_TTL_MINUTES = 60;

let resetSchemaReady = false;

export async function ensurePasswordResetSchema() {
  if (resetSchemaReady) return;

  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await runNeonQuery('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)');
  await runNeonQuery('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at)');

  resetSchemaReady = true;
}

export function generateResetToken() {
  return randomBytes(32).toString('hex');
}

export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function getResetTokenExpiryDate() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000).toISOString();
}

export function getResetTokenTtlMinutes() {
  return RESET_TOKEN_TTL_MINUTES;
}
