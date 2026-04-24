import { NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const connectionTest = {
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
    };
    
    // Test if we can connect to the database
    let dbConnection = false;
    try {
      await runNeonQuery('SELECT 1');
      dbConnection = true;
    } catch (e) {
      dbConnection = false;
    }
    
    // Test specific table permissions with detailed error logging
    const tableTests: any = {};
    
    const tables = ['users', 'contact_submissions', 'technical_trainings', 'non_technical_trainings', 'consulting_services', 'consultants'];
    for (const table of tables) {
      try {
        const countResult = await runNeonQuery<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${table}`);
        tableTests[table] = {
          accessible: true,
          count: Number(countResult.rows[0]?.count || 0),
          error: null,
        };
      } catch (e) {
        tableTests[table] = {
          accessible: false,
          error: e instanceof Error ? e.message : 'Unknown error',
          stack: e instanceof Error ? e.stack : undefined
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service role connection and permission test',
      connection: connectionTest,
      dbConnection,
      tableTests,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Service connection test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 