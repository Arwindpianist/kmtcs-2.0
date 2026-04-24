import { NextRequest, NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function POST(request: NextRequest) {
  try {
    console.log('Checking Neon admin tables...');
    const results: any = {};
    const tables = ['consultants', 'contact_submissions', 'users'];
    for (const table of tables) {
      try {
        await runNeonQuery(`SELECT 1 FROM ${table} LIMIT 1`);
        results[table] = { exists: true };
      } catch (err) {
        results[table] = { exists: false, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Neon table status checked',
      results,
      nextSteps: 'Create any missing tables in Neon.'
    });

  } catch (error) {
    console.error('Create tables error:', error);
    return NextResponse.json({ 
      error: `Failed to check tables: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 