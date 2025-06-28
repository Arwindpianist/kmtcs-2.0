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
    
    // Check if user exists and has admin role
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'admin')
      .single();
    
    if (error) {
      console.error('Check admin status error:', error);
      return NextResponse.json({
        success: false,
        isAdmin: false,
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      isAdmin: !!user,
      user: user || null
    });
    
  } catch (error) {
    console.error('Check admin status error:', error);
    return NextResponse.json({
      success: false,
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 