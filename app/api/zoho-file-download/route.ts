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
      },
      // Approach 6: Try the viewEventURL format from the debug output
      {
        name: 'View Event URL format',
        url: `https://calendar.zoho.com/zc/viewevent/${calendarUid}_EID${eventId}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 7: Try with different API domain
      {
        name: 'Different API domain',
        url: `https://www.zohoapis.com/calendar/v1/calendars/${calendarUid}/events/${eventId}/attachments/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 8: Try the attachment download endpoint from the viewEventURL
      {
        name: 'Attachment download from viewEventURL',
        url: `https://calendar.zoho.com/zc/viewevent/${calendarUid}_EID${eventId}/attachment/${fileId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 9: Try direct file download with different format
      {
        name: 'Direct file download with different format',
        url: `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events/${eventId}/attachments/${fileId}/download`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      // Approach 10: Try the original Zoho Mail URL but with different parameters
      {
        name: 'Zoho Mail URL with different parameters',
        url: `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}&token=${accessToken}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': `ZohoAccessToken=${accessToken}`,
        }
      },
      // Approach 11: Try the original Zoho Mail URL with session-based auth
      {
        name: 'Zoho Mail URL with session auth',
        url: `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}`,
        headers: {
          'Cookie': `ZohoAccessToken=${accessToken}; ZohoCalendarToken=${accessToken}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': `https://calendar.zoho.com/zc/viewevent/${calendarUid}_EID${eventId}`,
        }
      },
      // Approach 12: Try with different authentication header format
      {
        name: 'Zoho Mail URL with different auth format',
        url: `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}`,
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Cookie': `ZohoAccessToken=${accessToken}`,
        }
      }
    ];

    for (const approach of approaches) {
      try {
        console.log(`Trying ${approach.name}:`, approach.url);
        
        const response = await fetch(approach.url, {
          headers: approach.headers,
        });

        console.log(`${approach.name} response status:`, response.status);
        console.log(`${approach.name} response headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          console.log(`${approach.name} successful`);
          const fileBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          const contentDisposition = response.headers.get('content-disposition') || 'attachment';
          
          console.log(`${approach.name} file size:`, fileBuffer.byteLength);
          console.log(`${approach.name} content type:`, contentType);
          console.log(`${approach.name} content disposition:`, contentDisposition);
          
          if (fileBuffer.byteLength === 0) {
            console.log(`${approach.name} returned empty file`);
            continue;
          }
          
          // Check if we're getting HTML content instead of the actual file
          const textDecoder = new TextDecoder();
          const textContent = textDecoder.decode(fileBuffer.slice(0, 100)); // Check first 100 bytes
          if (textContent.toLowerCase().includes('<html') || textContent.toLowerCase().includes('<!doctype')) {
            console.log(`${approach.name} returned HTML content instead of file`);
            continue;
          }
          
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': contentDisposition,
              'Cache-Control': 'no-cache',
            },
          });
        } else {
          const errorText = await response.text();
          console.log(`${approach.name} failed:`, response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.log(`${approach.name} error:`, error);
      }
    }

    // If all approaches fail, redirect to the working Zoho Mail URL
    console.error('All download approaches failed, redirecting to Zoho Mail URL');
    const zohoMailUrl = `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}`;
    
    // Redirect to the Zoho Mail URL that works in browsers
    return NextResponse.redirect(zohoMailUrl, 302);

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
