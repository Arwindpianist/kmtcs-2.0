import { NextRequest, NextResponse } from 'next/server';

// Helper function to get a valid access token
async function getValidAccessToken(): Promise<string | null> {
  try {
    console.log('Getting valid access token...');
    
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    console.log('Refreshing access token...');
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.ZOHO_CLIENT_ID || '',
        client_secret: process.env.ZOHO_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      console.log('Token refresh failed:', tokenResponse.status);
      return null;
    }

    const tokenData = await tokenResponse.json();
    console.log('Token refresh successful, new token length:', tokenData.access_token?.length || 0);
    return tokenData.access_token;

  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get access token using helper function
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 500 }
      );
    }

    console.log('Listing calendars...');
    
    // Try to get list of calendars
    const calendarsEndpoint = 'https://calendar.zoho.com/api/v1/calendars';
    
    const response = await fetch(calendarsEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Calendars endpoint failed:', response.status, errorText);
      
      // If listing calendars fails, try to test the current calendar UID
      const currentCalendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
      
      return NextResponse.json({
        success: false,
        error: `Failed to list calendars: ${response.status} ${errorText}`,
        currentCalendarUid,
        suggestions: [
          'Check if the ZOHO_CALENDAR_UID environment variable is set correctly',
          'Verify that the access token has the correct permissions',
          'Try different calendar UID formats (with/without hyphens)',
          'Check Zoho Calendar API documentation for the correct endpoint'
        ]
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      calendars: data.calendars || data.data || data,
      currentCalendarUid: process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533',
      totalCalendars: (data.calendars || data.data || data).length || 0
    });

  } catch (error) {
    console.error('List calendars error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list calendars',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
