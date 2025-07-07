import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      clientId: !!process.env.ZOHO_CLIENT_ID,
      clientSecret: !!process.env.ZOHO_CLIENT_SECRET,
      redirectUri: !!process.env.ZOHO_REDIRECT_URI,
      refreshToken: !!process.env.ZOHO_REFRESH_TOKEN,
      accessToken: !!process.env.ZOHO_ACCESS_TOKEN,
    };

    console.log('Environment variables check:', envCheck);

    // Test token refresh
    let accessToken = process.env.ZOHO_ACCESS_TOKEN;
    let tokenRefreshSuccess = false;
    let tokenRefreshError = null;

    if (!accessToken && process.env.ZOHO_REFRESH_TOKEN) {
      try {
        console.log('Attempting to refresh token...');
        const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: process.env.ZOHO_REFRESH_TOKEN,
            client_id: process.env.ZOHO_CLIENT_ID || '',
            client_secret: process.env.ZOHO_CLIENT_SECRET || '',
            grant_type: 'refresh_token',
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          accessToken = tokenData.access_token;
          tokenRefreshSuccess = true;
          console.log('Token refresh successful');
        } else {
          const errorText = await tokenResponse.text();
          tokenRefreshError = `Token refresh failed: ${tokenResponse.status} ${errorText}`;
          console.error('Token refresh failed:', errorText);
        }
      } catch (error) {
        tokenRefreshError = `Token refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('Token refresh error:', error);
      }
    }

    // Test calendar API call
    let calendarTestSuccess = false;
    let calendarTestError = null;
    let calendarData = null;

    if (accessToken) {
      try {
        console.log('Testing calendar API call...');
        const calendarUid = 'f4c3dda451a2448fb8f12e629a46f533';
        const apiUrl = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
        
        const response = await fetch(`${apiUrl}?date_from=2025-01-01&date_to=2025-12-31`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          calendarData = await response.json();
          calendarTestSuccess = true;
          console.log('Calendar API call successful');
        } else {
          const errorText = await response.text();
          calendarTestError = `Calendar API failed: ${response.status} ${errorText}`;
          console.error('Calendar API failed:', errorText);
        }
      } catch (error) {
        calendarTestError = `Calendar API error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('Calendar API error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        environmentVariables: envCheck,
        tokenRefresh: {
          success: tokenRefreshSuccess,
          error: tokenRefreshError,
          hasAccessToken: !!accessToken,
        },
        calendarApi: {
          success: calendarTestSuccess,
          error: calendarTestError,
          data: calendarData ? {
            totalEvents: calendarData.events?.length || 0,
            sampleEvent: calendarData.events?.[0] ? {
              id: calendarData.events[0].event_id,
              title: calendarData.events[0].title,
              start_time: calendarData.events[0].start_time,
            } : null,
          } : null,
        },
      },
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