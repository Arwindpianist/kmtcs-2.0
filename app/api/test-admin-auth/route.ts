import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const result = await runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
    
    return NextResponse.json({
      success: true,
      message: 'Neon admin auth test completed',
      usersCount: Number(result.rows[0]?.count || 0),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test admin auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 