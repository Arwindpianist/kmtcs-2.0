import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    const supabase = createSupabaseServerClient();
    
    // Get admin user data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'admin')
      .single();
    
    if (error) {
      console.error('Get admin user error:', error);
      return NextResponse.json({
        success: false,
        user: null,
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      user: user || null
    });
    
  } catch (error) {
    console.error('Get admin user error:', error);
    return NextResponse.json({
      success: false,
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 