import { NextRequest, NextResponse } from 'next/server';

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

    const calendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
    const eventsEndpoint = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
    
    console.log('Debug: Making GET request to fetch raw events...');
    
    const response = await fetch(eventsEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API failed: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return detailed information about the first event
    const firstEvent = data.events?.[0];
    
    return NextResponse.json({
      success: true,
      totalEvents: data.events?.length || 0,
      firstEvent: firstEvent ? {
        title: firstEvent.title,
        uid: firstEvent.uid,
        dateandtime: firstEvent.dateandtime,
        dateandtimeType: typeof firstEvent.dateandtime,
        createdtime: firstEvent.createdtime,
        lastmodifiedtime: firstEvent.lastmodifiedtime,
        isallday: firstEvent.isallday,
        location: firstEvent.location,
        allFields: Object.keys(firstEvent),
        rawEvent: firstEvent
      } : null,
      allEvents: data.events?.map((event: any) => ({
        title: event.title,
        uid: event.uid,
        dateandtime: event.dateandtime,
        createdtime: event.createdtime,
        isallday: event.isallday
      })) || []
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to get a valid access token
async function getValidAccessToken(): Promise<string | null> {
  try {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    if (!refreshToken) {
      return null;
    }

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
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;

  } catch (error) {
    return null;
  }
} 