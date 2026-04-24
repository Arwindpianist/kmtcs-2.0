import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/options';
import { runNeonQuery } from '@/app/lib/db/neon';
import {
  ensurePasswordResetSchema,
  generateResetToken,
  getResetTokenExpiryDate,
  getResetTokenTtlMinutes,
  hashResetToken,
} from '@/app/lib/auth/passwordReset';
import { sendPasswordResetEmail } from '@/app/lib/emailService';

type UserRow = {
  id: string;
  email: string;
};

export async function POST(request: NextRequest) {
  try {
    await ensurePasswordResetSchema();
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userResult = await runNeonQuery<UserRow>(
      'SELECT id, email FROM users WHERE lower(email) = $1 LIMIT 1',
      [email]
    );
    const user = userResult.rows[0];

    if (user) {
      const session = await getServerSession(authOptions);
      const isAdminRequest = Boolean(session?.user?.role === 'admin');
      const sameUserRequest = Boolean(session?.user?.email?.toLowerCase() === email);
      const isPublicSelfRequest = !session || sameUserRequest;

      if (isAdminRequest || isPublicSelfRequest) {
        const token = generateResetToken();
        const tokenHash = hashResetToken(token);
        const expiresAt = getResetTokenExpiryDate();

        await runNeonQuery('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [user.id]);
        await runNeonQuery(
          `
          INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
          VALUES ($1, $2, $3)
          `,
          [user.id, tokenHash, expiresAt]
        );

        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.SITE_URL ||
          new URL(request.url).origin;
        const resetUrl = `${siteUrl.replace(/\/$/, '')}/reset-password?token=${token}`;

        await sendPasswordResetEmail({
          toEmail: user.email,
          resetUrl,
          expiresInMinutes: getResetTokenTtlMinutes(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('request-password-reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
