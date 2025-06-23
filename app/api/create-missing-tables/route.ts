import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('Creating missing admin tables...');

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create missing tables by testing if they exist first
    const results: any = {};

    // Test and create consultants table
    try {
      // First test if table exists
      const { data: testData, error: testError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Creating consultants table...');
        // We'll need to create this manually in the database
        results.consultants = { 
          created: false, 
          error: 'Table does not exist. Please run the migration manually.',
          exists: false
        };
      } else {
        results.consultants = { created: true, exists: true };
      }
    } catch (err) {
      results.consultants = { created: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    // Test and create contact_submissions table
    try {
      const { data: testData, error: testError } = await supabase
        .from('contact_submissions')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        console.log('Creating contact_submissions table...');
        results.contact_submissions = { 
          created: false, 
          error: 'Table does not exist. Please run the migration manually.',
          exists: false
        };
      } else {
        results.contact_submissions = { created: true, exists: true };
      }
    } catch (err) {
      results.contact_submissions = { created: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    // Test and create users table
    try {
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        console.log('Creating users table...');
        results.users = { 
          created: false, 
          error: 'Table does not exist. Please run the migration manually.',
          exists: false
        };
      } else {
        results.users = { created: true, exists: true };
      }
    } catch (err) {
      results.users = { created: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    return NextResponse.json({
      success: true,
      message: 'Table status checked',
      results,
      nextSteps: 'Please run the database migration manually to create missing tables'
    });

  } catch (error) {
    console.error('Create tables error:', error);
    return NextResponse.json({ 
      error: `Failed to check tables: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 