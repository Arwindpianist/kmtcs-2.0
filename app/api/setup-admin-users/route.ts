import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function GET() {
  return await setupAdminUsers();
}

export async function POST() {
  return await setupAdminUsers();
}

async function setupAdminUsers() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Define the admin users based on your Supabase Auth users
    const adminUsers = [
      {
        id: '47ba22ef-4378-4c88-a947-8c2d6ea176df',
        email: 'admin@kmtcs.com.my',
        full_name: 'KMTCS Administrator'
      },
      {
        id: 'e1ea81f3-4d56-4f5f-bb24-a228a62ca518',
        email: 'kanesan@kmtcs.com.my',
        full_name: 'Kanesan'
      }
    ];
    
    const results = [];
    
    for (const adminUser of adminUsers) {
      try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('id', adminUser.id)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          results.push({
            email: adminUser.email,
            success: false,
            error: 'Error checking existing user: ' + checkError.message
          });
          continue;
        }
        
        if (existingUser) {
          // Update existing user to admin role
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
              role: 'admin',
              full_name: adminUser.full_name,
              last_sign_in: new Date().toISOString()
            })
            .eq('id', adminUser.id)
            .select()
            .single();
          
          if (updateError) {
            results.push({
              email: adminUser.email,
              success: false,
              error: 'Error updating user: ' + updateError.message
            });
          } else {
            results.push({
              email: adminUser.email,
              success: true,
              action: 'updated',
              user: updatedUser
            });
          }
        } else {
          // Create new admin user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: adminUser.id,
              email: adminUser.email,
              role: 'admin',
              full_name: adminUser.full_name,
              created_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString()
            })
            .select()
            .single();
          
          if (createError) {
            results.push({
              email: adminUser.email,
              success: false,
              error: 'Error creating user: ' + createError.message
            });
          } else {
            results.push({
              email: adminUser.email,
              success: true,
              action: 'created',
              user: newUser
            });
          }
        }
      } catch (error) {
        results.push({
          email: adminUser.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin users setup completed',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Setup admin users error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 