import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const directQueries = await Promise.all([
      runNeonQuery('SELECT id, title FROM technical_trainings WHERE status = true ORDER BY created_at DESC LIMIT 3'),
      runNeonQuery('SELECT id, title FROM non_technical_trainings WHERE status = true ORDER BY created_at DESC LIMIT 3'),
      runNeonQuery('SELECT id, title FROM consulting_services WHERE status = true ORDER BY created_at DESC LIMIT 3'),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Homepage services test (Neon)',
      directQueries: {
        technical: {
          success: true,
          count: directQueries[0].rows.length,
          error: null
        },
        nonTechnical: {
          success: true,
          count: directQueries[1].rows.length,
          error: null
        },
        consulting: {
          success: true,
          count: directQueries[2].rows.length,
          error: null
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Homepage services test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 