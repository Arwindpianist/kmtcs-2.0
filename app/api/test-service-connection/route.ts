import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Test basic connection
    const connectionTest = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    };
    
    // Test if we can connect to the database
    let dbConnection = false;
    try {
      const { data, error } = await supabase
        .from('technical_trainings')
        .select('count')
        .limit(1);
      
      dbConnection = !error;
    } catch (e) {
      dbConnection = false;
    }
    
    // Test specific table permissions with detailed error logging
    const tableTests: any = {};
    
    // Test users table with detailed error
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      tableTests.users = {
        accessible: !usersError,
        count: users?.length || 0,
        error: usersError?.message,
        code: usersError?.code,
        details: usersError?.details,
        hint: usersError?.hint
      };
    } catch (e) {
      tableTests.users = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      };
    }
    
    // Test contact_submissions table with detailed error
    try {
      const { data: contacts, error: contactsError } = await supabase
        .from('contact_submissions')
        .select('*')
        .limit(1);
      
      tableTests.contact_submissions = {
        accessible: !contactsError,
        count: contacts?.length || 0,
        error: contactsError?.message,
        code: contactsError?.code,
        details: contactsError?.details,
        hint: contactsError?.hint
      };
    } catch (e) {
      tableTests.contact_submissions = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      };
    }
    
    // Test if we can query the information_schema to see table existence
    let schemaInfo = null;
    try {
      const { data: tables, error: schemaError } = await supabase
        .rpc('get_table_info');
      
      if (schemaError) {
        // Try direct query
        const { data: directTables, error: directError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['users', 'contact_submissions', 'technical_trainings', 'non_technical_trainings', 'consulting_services', 'consultants']);
        
        schemaInfo = {
          accessible: !directError,
          tables: directTables,
          error: directError?.message
        };
      } else {
        schemaInfo = {
          accessible: true,
          tables: tables
        };
      }
    } catch (e) {
      schemaInfo = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service role connection and permission test',
      connection: connectionTest,
      dbConnection,
      tableTests,
      schemaInfo,
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