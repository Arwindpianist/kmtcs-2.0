import { NextRequest, NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';
import { hashPassword } from '@/app/lib/auth/password';
import { ensurePasswordResetSchema, hashResetToken } from '@/app/lib/auth/passwordReset';

type TokenRow = {
  id: string;
  user_id: string;
  expires_at: string;
  used_at: string | null;
};

export async function POST(request: NextRequest) {
  try {
    await ensurePasswordResetSchema();
    const body = await request.json();
    const token = String(body.token || '');
    const newPassword = String(body.newPassword || '');

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const tokenHash = hashResetToken(token);
    const result = await runNeonQuery<TokenRow>(
      `
      SELECT id, user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token_hash = $1
      LIMIT 1
      `,
      [tokenHash]
    );
    const resetRow = result.rows[0];

    if (!resetRow) {
      return NextResponse.json({ error: 'Invalid reset link.' }, { status: 400 });
    }
    if (resetRow.used_at) {
      return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 });
    }
    if (new Date(resetRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This reset link has expired.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await runNeonQuery('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetRow.user_id]);
    await runNeonQuery('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [resetRow.id]);
    await runNeonQuery('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND id <> $2 AND used_at IS NULL', [
      resetRow.user_id,
      resetRow.id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('reset-password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
