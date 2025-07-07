import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.ZOHO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token available' }, { status: 500 });
    }

    // Test different possible API endpoint formats
    const endpoints = [
      'https://calendar.zoho.com/api/v1/calendars/f4c3dda451a2448fb8f12e629a46f533/events',
      'https://calendar.zoho.com/api/v1/calendars/f4c3dda451a2448fb8f12e629a46f533',
      'https://calendar.zoho.com/api/v1/events',
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const status = response.status;
        const responseText = await response.text();
        
        results.push({
          endpoint,
          status,
          success: response.ok,
          response: responseText.substring(0, 500), // Limit response size
        });

        console.log(`Endpoint ${endpoint}: ${status} - ${response.ok ? 'SUCCESS' : 'FAILED'}`);
        
        if (response.ok) {
          console.log('Successful response:', responseText.substring(0, 200));
        }
        
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          success: false,
          response: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 