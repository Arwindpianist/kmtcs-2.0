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

    const calendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
    const eventsEndpoint = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
    
    console.log('Test attachments: Making GET request to fetch events...');
    
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
    
    // Find events with attachments
    const eventsWithAttachments = data.events?.filter((event: any) => {
      return event.attach && event.attach.length > 0;
    }) || [];
    
    // Map events to show attachment details
    const mappedEvents = eventsWithAttachments.map((event: any) => ({
      id: event.uid || event.event_id || event.id,
      title: event.title || event.summary || event.name,
      attachments: (event.attach || []).map((att: any) => ({
        name: att.fileName || att.name || 'Attachment',
        fileId: att.fileId,
        size: att.size || 0,
        downloadUrl: `/api/zoho-file-download?fileId=${att.fileId}&eventId=${event.uid || event.event_id || event.id}&calendarUid=${calendarUid}`
      }))
    }));
    
    return NextResponse.json({
      success: true,
      totalEvents: data.events?.length || 0,
      eventsWithAttachments: mappedEvents.length,
      events: mappedEvents,
      calendarUid,
      accessTokenLength: accessToken.length
    });

  } catch (error) {
    console.error('Test attachments error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test attachments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
