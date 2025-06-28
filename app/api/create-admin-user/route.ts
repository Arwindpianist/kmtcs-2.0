import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    const supabase = createSupabaseServerClient();
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: 'Error checking existing user: ' + checkError.message
      }, { status: 500 });
    }
    
    if (existingUser) {
      // Update existing user to admin role
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          full_name: name || existingUser.full_name,
          last_sign_in: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();
      
      if (updateError) {
        return NextResponse.json({
          success: false,
          error: 'Error updating user: ' + updateError.message
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Admin user updated successfully',
        user: updatedUser
      });
    } else {
      // Create new admin user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          role: 'admin',
          full_name: name || 'KMTCS Administrator',
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        return NextResponse.json({
          success: false,
          error: 'Error creating user: ' + createError.message
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        user: newUser
      });
    }
    
  } catch (error) {
    console.error('Create admin user error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 