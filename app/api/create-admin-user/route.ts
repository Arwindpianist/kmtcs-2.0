import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';
import { hashPassword } from '@/app/lib/auth/password';

export async function POST(request: Request) {
  try {
    const setupKey = process.env.ADMIN_SETUP_KEY;
    if (setupKey) {
      const providedKey = request.headers.get('x-setup-key');
      if (providedKey !== setupKey) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { email, name, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters',
      }, { status: 400 });
    }

    await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await runNeonQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');

    const nowIso = new Date().toISOString();
    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const existingResult = await runNeonQuery<Record<string, unknown>>(
      'SELECT * FROM users WHERE lower(email) = $1 LIMIT 1',
      [normalizedEmail]
    );
    const existingUser = existingResult.rows[0];

    if (existingUser) {
      const updated = await runNeonQuery<Record<string, unknown>>(
        `
        UPDATE users
        SET role = 'admin', full_name = $1, password_hash = $2, last_sign_in = $3
        WHERE lower(email) = $4
        RETURNING *
        `,
        [name || (existingUser.full_name as string | undefined) || 'KMTCS Administrator', passwordHash, nowIso, normalizedEmail]
      );
      return NextResponse.json({
        success: true,
        message: 'Admin user updated successfully',
        user: updated.rows[0] ?? null
      });
    }

    const created = await runNeonQuery<Record<string, unknown>>(
      `
      INSERT INTO users (id, email, role, full_name, password_hash, created_at, last_sign_in)
      VALUES (gen_random_uuid(), $1, 'admin', $2, $3, $4, $4)
      RETURNING *
      `,
      [normalizedEmail, name || 'KMTCS Administrator', passwordHash, nowIso]
    );

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: created.rows[0] ?? null
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 