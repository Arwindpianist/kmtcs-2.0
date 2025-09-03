import { NextRequest, NextResponse } from 'next/server';

// Helper function to get a valid access token
async function getValidAccessToken(): Promise<string | null> {
  try {
    // First, try to use existing access token if it's still valid
    const existingToken = process.env.ZOHO_ACCESS_TOKEN;
    if (existingToken) {
      return existingToken;
    }

    // If no existing token or it's expired, use refresh token
    const response = await fetch('/api/zoho-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'refresh_token' }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.access_token;

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
