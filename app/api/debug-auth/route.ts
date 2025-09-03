import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envVars = {
      hasClientId: !!process.env.ZOHO_CLIENT_ID,
      hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET,
      hasRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN,
      hasAccessToken: !!process.env.ZOHO_ACCESS_TOKEN,
      hasCalendarUid: !!process.env.ZOHO_CALENDAR_UID,
      clientIdLength: process.env.ZOHO_CLIENT_ID?.length || 0,
      clientSecretLength: process.env.ZOHO_CLIENT_SECRET?.length || 0,
      refreshTokenLength: process.env.ZOHO_REFRESH_TOKEN?.length || 0,
      accessTokenLength: process.env.ZOHO_ACCESS_TOKEN?.length || 0,
      calendarUid: process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533'
    };

    // Try to refresh token
    let tokenRefreshResult = null;
    try {
      const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
      if (refreshToken) {
        console.log('Attempting token refresh...');
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

        tokenRefreshResult = {
          status: tokenResponse.status,
          ok: tokenResponse.ok,
          response: tokenResponse.ok ? await tokenResponse.json() : await tokenResponse.text()
        };
      }
    } catch (error) {
      tokenRefreshResult = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test calendar API with fresh token
    let calendarTestResult = null;
    if (tokenRefreshResult?.ok && tokenRefreshResult.response?.access_token) {
      try {
        const calendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
        const eventsEndpoint = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
        
        const response = await fetch(eventsEndpoint, {
          headers: {
            'Authorization': `Bearer ${tokenRefreshResult.response.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        calendarTestResult = {
          status: response.status,
          ok: response.ok,
          response: response.ok ? await response.json() : await response.text()
        };
      } catch (error) {
        calendarTestResult = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      success: true,
      environmentVariables: envVars,
      tokenRefresh: tokenRefreshResult,
      calendarTest: calendarTestResult
    });

  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug auth',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
