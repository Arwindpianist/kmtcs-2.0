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

    // Only refresh token if we don't have a valid one
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
          console.log('New token length:', tokenData.access_token?.length || 0);
          console.log('Token scope:', tokenData.scope || 'No scope returned');
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
    let getResponseStatus = null;
    let postResponseStatus = null;

    if (accessToken) {
      try {
        console.log('Testing calendar API call...');
        const calendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
        const apiUrl = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
        
        console.log('Using calendar UID:', calendarUid);
        console.log('Using API URL:', apiUrl);
        
        // Test both GET and POST requests
        console.log('Testing GET request...');
        const getResponse = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        getResponseStatus = getResponse.status;
        console.log('GET response status:', getResponseStatus);
        
        // Test POST request with date range (like the main API)
        console.log('Testing POST request with date range...');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfThreeMonths = new Date(now.getFullYear(), now.getMonth() + 3, 0);
        const zohoStartDate = startOfMonth.toISOString().slice(0, 10).replace(/-/g, '');
        const zohoEndDate = endOfThreeMonths.toISOString().slice(0, 10).replace(/-/g, '');
        
        console.log('Date range:', { zohoStartDate, zohoEndDate });
        
        const postResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json+large'
          },
          body: JSON.stringify({
            range: {
              start: zohoStartDate,
              end: zohoEndDate
            },
            byinstance: true,
            timezone: 'Asia/Kuala_Lumpur'
          })
        });

        postResponseStatus = postResponse.status;
        console.log('POST response status:', postResponseStatus);
        
        // Use the successful response
        const response = postResponse.ok ? postResponse : getResponse;

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
          calendarUid: process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533',
          getResponseStatus: getResponseStatus,
          postResponseStatus: postResponseStatus,
          data: calendarData ? {
            totalEvents: calendarData.events?.length || 0,
            sampleEvent: calendarData.events?.[0] ? {
              id: calendarData.events[0].event_id || calendarData.events[0].id,
              title: calendarData.events[0].title,
              start_time: calendarData.events[0].start_time || calendarData.events[0].start,
            } : null,
            rawEventStructure: calendarData.events?.[0] ? Object.keys(calendarData.events[0]) : null,
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