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
    
    // Update last sign in timestamp
    const { data: user, error } = await supabase
      .from('users')
      .update({ last_sign_in: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Update last sign in error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Update last sign in error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 