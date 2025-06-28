import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    console.log('Testing homepage services fetch...');
    
    // Simulate exactly what the homepage does
    const [technicalResponse, nonTechnicalResponse, consultingResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/api/technical-trainings?status=true&limit=3`),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/api/non-technical-trainings?status=true&limit=3`),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/api/consulting-services?status=true&limit=3`)
    ]);

    // Check if responses are ok
    const responses = {
      technical: {
        ok: technicalResponse.ok,
        status: technicalResponse.status,
        statusText: technicalResponse.statusText
      },
      nonTechnical: {
        ok: nonTechnicalResponse.ok,
        status: nonTechnicalResponse.status,
        statusText: nonTechnicalResponse.statusText
      },
      consulting: {
        ok: consultingResponse.ok,
        status: consultingResponse.status,
        statusText: consultingResponse.statusText
      }
    };

    // Try to get the data
    let technicalData, nonTechnicalData, consultingData;
    
    try {
      technicalData = await technicalResponse.json();
    } catch (e) {
      technicalData = { error: 'Failed to parse JSON', details: e };
    }
    
    try {
      nonTechnicalData = await nonTechnicalResponse.json();
    } catch (e) {
      nonTechnicalData = { error: 'Failed to parse JSON', details: e };
    }
    
    try {
      consultingData = await consultingResponse.json();
    } catch (e) {
      consultingData = { error: 'Failed to parse JSON', details: e };
    }

    // Also try direct database queries as fallback
    const directQueries = {
      technical: await supabase.from('technical_trainings').select('*').eq('status', true).limit(3),
      nonTechnical: await supabase.from('non_technical_trainings').select('*').eq('status', true).limit(3),
      consulting: await supabase.from('consulting_services').select('*').eq('status', true).limit(3)
    };

    return NextResponse.json({
      success: true,
      message: 'Homepage services test',
      apiResponses: responses,
      apiData: {
        technical: technicalData,
        nonTechnical: nonTechnicalData,
        consulting: consultingData
      },
      directQueries: {
        technical: {
          success: !directQueries.technical.error,
          count: directQueries.technical.data?.length || 0,
          error: directQueries.technical.error?.message
        },
        nonTechnical: {
          success: !directQueries.nonTechnical.error,
          count: directQueries.nonTechnical.data?.length || 0,
          error: directQueries.nonTechnical.error?.message
        },
        consulting: {
          success: !directQueries.consulting.error,
          count: directQueries.consulting.data?.length || 0,
          error: directQueries.consulting.error?.message
        }
      },
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Homepage services test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 