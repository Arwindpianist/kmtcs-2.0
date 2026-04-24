import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/options';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, isAdmin: false, error: 'Unauthorized' }, { status: 401 });
    }

    const requestedUserId = body?.userId as string | undefined;
    const userId = requestedUserId && session.user.role === 'admin' ? requestedUserId : session.user.id;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    const result = await runNeonQuery<Record<string, unknown>>(
      'SELECT * FROM users WHERE id = $1 AND role = $2 LIMIT 1',
      [userId, 'admin']
    );
    const user = result.rows[0] ?? null;

    return NextResponse.json({
      success: true,
      isAdmin: !!user,
      user: user || null
    });
    
  } catch (error) {
    console.error('Check admin status error:', error);
    return NextResponse.json({
      success: false,
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 