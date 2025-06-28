import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const supabaseServer = createSupabaseServerClient();
    
    console.log('Testing admin authentication...');
    
    // Test 1: Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Test 2: Check if we can access the users table
    const { data: users, error: usersError } = await supabaseServer
      .from('users')
      .select('*')
      .limit(5);
    
    // Test 3: Check if there are any admin users
    const { data: adminUsers, error: adminError } = await supabaseServer
      .from('users')
      .select('*')
      .eq('role', 'admin');
    
    // Test 4: Check if current user exists in users table
    let currentUserInTable = null;
    if (session?.user) {
      const { data: currentUser, error: currentUserError } = await supabaseServer
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      currentUserInTable = {
        found: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        user: currentUser,
        error: currentUserError?.message
      };
    }
    
    // Test 5: Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL
    };
    
    // Test 6: Check if we can query the auth.users table (if it exists)
    let authUsers = null;
    try {
      const { data: authData, error: authError } = await supabaseServer
        .from('auth.users')
        .select('*')
        .limit(1);
      
      authUsers = {
        accessible: !authError,
        count: authData?.length || 0,
        error: authError?.message
      };
    } catch (e) {
      authUsers = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin authentication test results',
      session: {
        exists: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: sessionError?.message
      },
      currentUserInTable,
      usersTable: {
        accessible: !usersError,
        count: users?.length || 0,
        error: usersError?.message,
        data: users
      },
      adminUsers: {
        accessible: !adminError,
        count: adminUsers?.length || 0,
        error: adminError?.message,
        data: adminUsers
      },
      authUsers,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 