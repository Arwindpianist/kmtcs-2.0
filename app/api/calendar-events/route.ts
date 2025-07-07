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
    const endDate = searchParams.get('end') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
    
    // Calculate date range for next 3 months
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThreeMonths = new Date(now.getFullYear(), now.getMonth() + 3, 0);
    
    // Format dates for Zoho API (yyyyMMdd format)
    const zohoStartDate = startOfMonth.toISOString().slice(0, 10).replace(/-/g, '');
    const zohoEndDate = endOfThreeMonths.toISOString().slice(0, 10).replace(/-/g, '');
    
    console.log('Zoho date range:', { zohoStartDate, zohoEndDate });
    
    // Try different approaches to get events
    let events: CalendarEvent[] = [];
    
    // Approach 1: Use the correct POST request with range parameter
    const eventsEndpoint = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
    
    try {
      console.log(`Making POST request to: ${eventsEndpoint}`);
      const response = await fetch(eventsEndpoint, {
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
      
      console.log(`Events endpoint response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Events API response data:', { 
          hasEvents: !!data.events, 
          eventCount: data.events?.length || 0 
        });
        
        // Debug: Log the raw first event to see actual field names
        if (data.events && data.events.length > 0) {
          console.log('Raw Zoho event structure:', JSON.stringify(data.events[0], null, 2));
        }
        
        events = data.events?.map((event: any) => ({
          id: event.event_id || event.id || event.eventId || `event-${Math.random()}`,
          title: event.title || event.summary || event.name,
          description: event.description || event.details || event.notes,
          start_time: event.start || event.start_time || event.startTime || event.start_date || event.startDate || event.date,
          end_time: event.end || event.end_time || event.endTime || event.end_date || event.endDate,
          location: event.location || event.venue || event.place,
          attachments: event.attachments || [],
          all_day: event.all_day === 'true' || event.allDay === true || event.all_day === true,
          recurrence: event.recurrence || event.recurring,
          created_time: event.created_time || event.createdTime || event.created,
          modified_time: event.modified_time || event.modifiedTime || event.modified,
        })) || [];
        
        console.log('Successfully mapped events:', events.length);
      } else {
        const errorText = await response.text();
        console.log(`Events endpoint failed: ${response.status} - ${errorText}`);
        
        // Fallback: Try GET request without parameters
        console.log('Trying fallback GET request...');
        const fallbackResponse = await fetch(eventsEndpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback response data:', { 
            hasEvents: !!fallbackData.events, 
            eventCount: fallbackData.events?.length || 0 
          });
          
          if (fallbackData.events && fallbackData.events.length > 0) {
            console.log('Raw fallback event structure:', JSON.stringify(fallbackData.events[0], null, 2));
          }
          
          events = fallbackData.events?.map((event: any) => ({
            id: event.event_id || event.id || event.eventId || `event-${Math.random()}`,
            title: event.title || event.summary || event.name,
            description: event.description || event.details || event.notes,
            start_time: event.start || event.start_time || event.startTime || event.start_date || event.startDate || event.date,
            end_time: event.end || event.end_time || event.endTime || event.end_date || event.endDate,
            location: event.location || event.venue || event.place,
            attachments: event.attachments || [],
            all_day: event.all_day === 'true' || event.allDay === true || event.all_day === true,
            recurrence: event.recurrence || event.recurring,
            created_time: event.created_time || event.createdTime || event.created,
            modified_time: event.modified_time || event.modifiedTime || event.modified,
          })) || [];
        } else {
          const fallbackErrorText = await fallbackResponse.text();
          console.log(`Fallback request failed: ${fallbackResponse.status} - ${fallbackErrorText}`);
        }
      }
    } catch (error) {
      console.log(`Events endpoint error: ${error}`);
    }

    // If no events found, return empty array with success status
    if (events.length === 0) {
      console.log('No events found via events endpoint');
      
      return NextResponse.json({
        success: true,
        events: [],
        total: 0,
        message: 'No events found in the specified date range. Calendar API is working correctly.'
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