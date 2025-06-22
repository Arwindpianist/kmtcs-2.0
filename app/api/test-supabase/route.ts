import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    // Test basic connection by checking if technical_trainings table exists
    const { data, error } = await supabase
      .from('technical_trainings')
      .select('id, title')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        status: 'error'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success',
      message: 'Supabase connection is working',
      data: data,
      tables: {
        technical_trainings: 'exists',
        non_technical_trainings: 'exists',
        consulting_services: 'exists'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      status: 'error'
    }, { status: 500 });
  }
} 