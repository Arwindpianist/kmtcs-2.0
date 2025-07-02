import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    console.log('Test admin tables endpoint called');
    
    const supabase = createSupabaseServerClient();
    const results: any = {
      timestamp: new Date().toISOString(),
      tables: {},
      users: {},
      adminUsers: {},
      rlsPolicies: {}
    };
    
    // Test 1: Check if users table exists and is accessible
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      results.tables.users = {
        accessible: !usersError,
        count: users?.length || 0,
        error: usersError?.message || null,
        sample: users?.slice(0, 2) || []
      };
    } catch (error) {
      results.tables.users = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Test 2: Check for admin users
    try {
      const { data: adminUsers, error: adminError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin');
      
      results.adminUsers = {
        accessible: !adminError,
        count: adminUsers?.length || 0,
        error: adminError?.message || null,
        users: adminUsers || []
      };
    } catch (error) {
      results.adminUsers = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Test 3: Check if technical_trainings table exists
    try {
      const { data: techTrainings, error: techError } = await supabase
        .from('technical_trainings')
        .select('count')
        .limit(1);
      
      results.tables.technical_trainings = {
        accessible: !techError,
        error: techError?.message || null
      };
    } catch (error) {
      results.tables.technical_trainings = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Test 4: Check if non_technical_trainings table exists
    try {
      const { data: nonTechTrainings, error: nonTechError } = await supabase
        .from('non_technical_trainings')
        .select('count')
        .limit(1);
      
      results.tables.non_technical_trainings = {
        accessible: !nonTechError,
        error: nonTechError?.message || null
      };
    } catch (error) {
      results.tables.non_technical_trainings = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Test 5: Check RLS policies (basic check)
    try {
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_rls_policies', { table_name: 'users' });
      
      results.rlsPolicies = {
        checkable: !policiesError,
        error: policiesError?.message || null,
        policies: policies || []
      };
    } catch (error) {
      results.rlsPolicies = {
        checkable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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