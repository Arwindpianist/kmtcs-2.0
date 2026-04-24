import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      tables: {}
    };

    const tables = ['users', 'technical_trainings', 'non_technical_trainings', 'consulting_services', 'consultants', 'contact_submissions'];
    for (const table of tables) {
      const query = `SELECT COUNT(*)::text AS count FROM ${table}`;
      try {
        const countResult = await runNeonQuery<{ count: string }>(query);
        results.tables[table] = { accessible: true, count: Number(countResult.rows[0]?.count || 0) };
      } catch (error) {
        results.tables[table] = { accessible: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin tables test completed',
      results
    });
    
  } catch (error) {
    console.error('Test admin tables error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 