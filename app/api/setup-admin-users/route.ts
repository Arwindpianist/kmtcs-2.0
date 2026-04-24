import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';
import { hashPassword } from '@/app/lib/auth/password';

export async function GET() {
  return await setupAdminUsers();
}

export async function POST() {
  return await setupAdminUsers();
}

async function setupAdminUsers() {
  try {
    await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await runNeonQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMeNow123!';
    const passwordHash = await hashPassword(defaultPassword);
    
    // Define the admin users based on your Supabase Auth users
    const adminUsers = [
      {
        id: '47ba22ef-4378-4c88-a947-8c2d6ea176df',
        email: 'admin@kmtcs.com.my',
        full_name: 'KMTCS Administrator'
      },
      {
        id: 'e1ea81f3-4d56-4f5f-bb24-a228a62ca518',
        email: 'kanesan@kmtcs.com.my',
        full_name: 'Kanesan'
      }
    ];
    
    const results = [];
    
    for (const adminUser of adminUsers) {
      try {
        // Check if user already exists
        const existingResult = await runNeonQuery<Record<string, unknown>>(
          'SELECT * FROM users WHERE id = $1 LIMIT 1',
          [adminUser.id]
        );
        const existingUser = existingResult.rows[0];
        
        if (existingUser) {
          const updatedResult = await runNeonQuery<Record<string, unknown>>(
            `
            UPDATE users
            SET role = 'admin', full_name = $1, last_sign_in = NOW(), password_hash = $2
            WHERE id = $3
            RETURNING *
            `,
            [adminUser.full_name, passwordHash, adminUser.id]
          );
          results.push({
            email: adminUser.email,
            success: true,
            action: 'updated',
            user: updatedResult.rows[0] ?? null
          });
        } else {
          const createdResult = await runNeonQuery<Record<string, unknown>>(
            `
            INSERT INTO users (id, email, role, full_name, password_hash, created_at, last_sign_in)
            VALUES ($1, $2, 'admin', $3, $4, NOW(), NOW())
            RETURNING *
            `,
            [adminUser.id, adminUser.email, adminUser.full_name, passwordHash]
          );
          results.push({
            email: adminUser.email,
            success: true,
            action: 'created',
            user: createdResult.rows[0] ?? null
          });
        }
      } catch (error) {
        results.push({
          email: adminUser.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin users setup completed',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Setup admin users error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 