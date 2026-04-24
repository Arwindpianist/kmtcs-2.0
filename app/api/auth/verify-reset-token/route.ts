import { NextRequest, NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';
import { ensurePasswordResetSchema, hashResetToken } from '@/app/lib/auth/passwordReset';

type TokenRow = {
  id: string;
  expires_at: string;
  used_at: string | null;
};

export async function GET(request: NextRequest) {
  try {
    await ensurePasswordResetSchema();
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 });
    }

    const tokenHash = hashResetToken(token);
    const result = await runNeonQuery<TokenRow>(
      `
      SELECT id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token_hash = $1
      LIMIT 1
      `,
      [tokenHash]
    );

    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({ valid: false, error: 'Invalid reset link' }, { status: 400 });
    }
    if (row.used_at) {
      return NextResponse.json({ valid: false, error: 'Reset link was already used' }, { status: 400 });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ valid: false, error: 'Reset link has expired' }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('verify-reset-token error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
