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
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const eventId = searchParams.get('eventId');
    const calendarUid = searchParams.get('calendarUid') || process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';

    if (!fileId || !eventId) {
      return NextResponse.json(
        { error: 'Missing required parameters: fileId and eventId' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      console.error('Failed to obtain Zoho access token');
      return NextResponse.json(
        { error: 'Calendar API authentication failed - no access token available' },
        { status: 500 }
      );
    }

    console.log('Downloading file:', { fileId, eventId, calendarUid });

    // Try multiple approaches to download the file
    const approaches = [
      // Approach 1: Direct Zoho calendar attachment URL
      {
        name: 'Direct Calendar API',
        url: `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events/${eventId}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 2: Zoho Mail attachment URL (original approach)
      {
        name: 'Zoho Mail URL',
        url: `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': `ZohoAccessToken=${accessToken}`,
        }
      },
      // Approach 3: Calendar UID without hyphens
      {
        name: 'Calendar UID without hyphens',
        url: `https://calendar.zoho.com/api/v1/calendars/${calendarUid.replace(/-/g, '')}/events/${eventId}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 4: Try with different event ID format
      {
        name: 'Alternative event ID format',
        url: `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events/${eventId.replace(/-/g, '')}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 5: Try with both calendar and event UID without hyphens
      {
        name: 'Both UIDs without hyphens',
        url: `https://calendar.zoho.com/api/v1/calendars/${calendarUid.replace(/-/g, '')}/events/${eventId.replace(/-/g, '')}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    ];

    for (const approach of approaches) {
      try {
        console.log(`Trying ${approach.name}:`, approach.url);
        
        const response = await fetch(approach.url, {
          headers: approach.headers,
        });

        if (response.ok) {
          console.log(`${approach.name} successful`);
          const fileBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          const contentDisposition = response.headers.get('content-disposition') || 'attachment';
          
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': contentDisposition,
              'Cache-Control': 'no-cache',
            },
          });
        } else {
          console.log(`${approach.name} failed:`, response.status, response.statusText);
        }
      } catch (error) {
        console.log(`${approach.name} error:`, error);
      }
    }

    // If all approaches fail, return error
    console.error('All download approaches failed');
    return NextResponse.json(
      { 
        error: 'Calendar not found',
        errorcode: 'CALENDAR_NOTFOUND',
        status: 'failure',
        details: 'Unable to download attachment from Zoho Calendar'
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
