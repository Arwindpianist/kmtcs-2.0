import { NextRequest, NextResponse } from 'next/server';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  all_day: boolean;
  recurrence?: string;
  created_time: string;
  modified_time: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log('Calendar events request:', { startDate, endDate });

    // Zoho Calendar API endpoint
    const calendarUid = 'f4c3dda451a2448fb8f12e629a46f533';
    
    // Get access token using helper function
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      console.error('Failed to obtain Zoho access token');
      return NextResponse.json(
        { error: 'Calendar API authentication failed - no access token available' },
        { status: 500 }
      );
    }

    console.log('Making API call to Zoho Calendar...');
    
    // Try different approaches to get events
    let events: CalendarEvent[] = [];
    
    // Approach 1: Try the events endpoint with different scopes
    const eventsEndpoints = [
      `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`,
      `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events?date_from=${startDate}&date_to=${endDate}`,
      `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events?from=${startDate}&to=${endDate}`,
    ];

    for (const endpoint of eventsEndpoints) {
      try {
        console.log(`Trying events endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`Events endpoint response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Events API response data:', { 
            hasEvents: !!data.events, 
            eventCount: data.events?.length || 0 
          });
          
          events = data.events?.map((event: any) => ({
            id: event.event_id,
            title: event.title,
            description: event.description,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            attachments: event.attachments || [],
            all_day: event.all_day === 'true',
            recurrence: event.recurrence,
            created_time: event.created_time,
            modified_time: event.modified_time,
          })) || [];
          
          break; // Success, exit the loop
        } else {
          const errorText = await response.text();
          console.log(`Events endpoint failed: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.log(`Events endpoint error: ${error}`);
      }
    }

    // If no events found, try alternative approach
    if (events.length === 0) {
      console.log('No events found via events endpoint, trying alternative approach...');
      
      // For now, return empty events array but with success status
      // We'll need to get the correct OAuth scope to access events
      return NextResponse.json({
        success: true,
        events: [],
        total: 0,
        message: 'Calendar API working but events access requires different OAuth scope. Please use the authorization URLs from /api/zoho-auth-scope to get the correct scope.'
      });
    }

    console.log('Transformed events:', events.length);

    return NextResponse.json({
      success: true,
      events,
      total: events.length
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to get a valid access token
async function getValidAccessToken(): Promise<string | null> {
  try {
    console.log('Getting valid access token...');
    
    // First, try to use existing access token if it's still valid
    const existingToken = process.env.ZOHO_ACCESS_TOKEN;
    if (existingToken) {
      console.log('Using existing access token');
      return existingToken;
    }

    // If no existing token or it's expired, use refresh token
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    if (!refreshToken) {
      console.error('No refresh token configured');
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
      const errorText = await tokenResponse.text();
      console.error('Token refresh failed:', errorText);
      throw new Error(`Failed to refresh token: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token refresh successful');
    return tokenData.access_token;

  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
} 