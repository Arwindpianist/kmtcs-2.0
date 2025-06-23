import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    console.log('Testing admin tables...');

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test all tables needed by admin dashboard
    const tables = [
      'technical_trainings',
      'non_technical_trainings', 
      'consulting_services',
      'contact_submissions'
    ];

    const results: any = {};

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          results[table] = {
            exists: false,
            error: error.message,
            code: error.code
          };
        } else {
          results[table] = {
            exists: true,
            count: count || 0,
            accessible: true
          };
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    // Check if all required tables exist and are accessible
    const allTablesExist = Object.values(results).every((result: any) => result.exists);
    const allTablesAccessible = Object.values(results).every((result: any) => result.accessible);

    return NextResponse.json({
      success: allTablesExist && allTablesAccessible,
      message: allTablesExist && allTablesAccessible 
        ? 'All admin tables exist and are accessible' 
        : 'Some admin tables are missing or inaccessible',
      tables: results,
      summary: {
        totalTables: tables.length,
        existingTables: Object.values(results).filter((r: any) => r.exists).length,
        accessibleTables: Object.values(results).filter((r: any) => r.accessible).length
      }
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 