import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing');

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test basic connection by checking if document_uploads table exists
    const { data, error } = await supabase
      .from('document_uploads')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database test error:', error);
      
      // Check if it's a table not found error
      if (error.code === '42P01') {
        return NextResponse.json({ 
          error: 'Table document_uploads does not exist',
          code: error.code,
          message: error.message
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: `Database connection failed: ${error.message}`,
        code: error.code
      }, { status: 500 });
    }

    // Test insert permission
    const { data: insertData, error: insertError } = await supabase
      .from('document_uploads')
      .insert({
        file_name: 'test.txt',
        file_path: 'test',
        file_size: 100,
        file_type: 'text/plain',
        upload_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert test error:', insertError);
      return NextResponse.json({ 
        error: `Insert permission failed: ${insertError.message}`,
        code: insertError.code
      }, { status: 500 });
    }

    // Clean up test record
    await supabase
      .from('document_uploads')
      .delete()
      .eq('id', insertData.id);

    return NextResponse.json({
      success: true,
      message: 'Database connection and permissions are working correctly',
      tableExists: true,
      insertTest: 'passed'
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 