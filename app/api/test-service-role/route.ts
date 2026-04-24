import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const results: any = {};
    const tables = ['users', 'contact_submissions', 'technical_trainings', 'non_technical_trainings', 'consulting_services', 'consultants'];
    for (const table of tables) {
      try {
        const countResult = await runNeonQuery<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${table}`);
        results[table] = {
          accessible: true,
          count: Number(countResult.rows[0]?.count || 0),
          error: null,
        };
      } catch (e) {
        results[table] = {
          accessible: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service role access test results',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Service role test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 