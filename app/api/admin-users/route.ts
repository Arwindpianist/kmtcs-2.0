import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/options';
import { runNeonQuery } from '@/app/lib/db/neon';
import { hashPassword } from '@/app/lib/auth/password';

type UserRow = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  last_sign_in: string | null;
};

let authSchemaReady = false;

async function ensureAuthSchema() {
  if (authSchemaReady) return;
  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await runNeonQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
  authSchemaReady = true;
}

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET() {
  await ensureAuthSchema();
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runNeonQuery<UserRow>(
    'SELECT id, email, role, full_name, created_at, last_sign_in FROM users ORDER BY created_at DESC'
  );
  return NextResponse.json({ data: result.rows });
}

export async function POST(request: NextRequest) {
  await ensureAuthSchema();
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const role = body.role === 'admin' ? 'admin' : 'editor';
  const fullName = body.fullName ? String(body.fullName) : null;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const result = await runNeonQuery<UserRow>(
    `
    INSERT INTO users (id, email, role, full_name, password_hash, created_at, last_sign_in)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NULL)
    RETURNING id, email, role, full_name, created_at, last_sign_in
    `,
    [email, role, fullName, passwordHash]
  );

  return NextResponse.json({ data: result.rows[0] });
}

export async function PUT(request: NextRequest) {
  await ensureAuthSchema();
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || '').trim();
  const role = body.role === 'admin' ? 'admin' : 'editor';
  const fullName = body.fullName ? String(body.fullName) : null;
  const password = body.password ? String(body.password) : '';

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    const result = await runNeonQuery<UserRow>(
      `
      UPDATE users
      SET role = $1, full_name = $2, password_hash = $3
      WHERE id = $4
      RETURNING id, email, role, full_name, created_at, last_sign_in
      `,
      [role, fullName, passwordHash, id]
    );
    return NextResponse.json({ data: result.rows[0] ?? null });
  }

  const result = await runNeonQuery<UserRow>(
    `
    UPDATE users
    SET role = $1, full_name = $2
    WHERE id = $3
    RETURNING id, email, role, full_name, created_at, last_sign_in
    `,
    [role, fullName, id]
  );
  return NextResponse.json({ data: result.rows[0] ?? null });
}

export async function DELETE(request: NextRequest) {
  await ensureAuthSchema();
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Prevent deleting own account in the UI API.
  if (id === session.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  await runNeonQuery('DELETE FROM users WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
