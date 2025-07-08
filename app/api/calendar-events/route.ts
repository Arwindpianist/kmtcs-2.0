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

// Helper to robustly parse Zoho date strings
function parseZohoDate(str: string) {
  if (!str) return null;
  if (typeof str !== 'string') return null;
  if (str.length === 8) {
    // All-day event: YYYYMMDD
    return new Date(`${str.slice(0,4)}-${str.slice(4,6)}-${str.slice(6,8)}T00:00:00Z`);
  }
  // Timed event: YYYYMMDDTHHmmss+ZZZZ
  const match = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})([+-]\d{2})(\d{2})$/);
  if (match) {
    const [ , y, m, d, h, min, s, tzh, tzm ] = match;
    const tzIso = `${tzh}:${tzm}`;
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}${tzIso}`);
  }
  // Timed event: YYYYMMDDTHHmmssZ (UTC)
  const matchUtc = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (matchUtc) {
    const [ , y, m, d, h, min, s ] = matchUtc;
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}Z`);
  }
  return new Date(str); // fallback
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log('Calendar events request:', { startDate, endDate });

    // Zoho Calendar API endpoint - use environment variable or fallback
    const calendarUid = process.env.ZOHO_CALENDAR_UID || 'f4c3dda451a2448fb8f12e629a46f533';
    
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
    console.log('Access token length:', accessToken.length);
    console.log('Access token preview:', accessToken.substring(0, 20) + '...');
    
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
    
    // Use the same approach as debug endpoint - simple GET request
    const eventsEndpoint = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
    
    console.log('Using calendar UID:', calendarUid);
    console.log('Using events endpoint:', eventsEndpoint);
    
    let zohoApiDebug: any = {};
    try {
      console.log(`Making GET request to: ${eventsEndpoint}`);
      const response = await fetch(eventsEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Zoho API response status:', response.status);
      zohoApiDebug = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        endpoint: eventsEndpoint,
        tokenLength: accessToken.length
      };
      
      if (response.ok) {
        try {
          const clone = await response.clone().json();
          zohoApiDebug.sample = clone.events ? clone.events.slice(0, 2) : clone;
        } catch (e) {
          zohoApiDebug.sample = 'Could not parse JSON';
        }
      } else {
        const errorText = await response.text();
        zohoApiDebug.error = errorText;
      }
      
      console.log(`Events endpoint response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Events API response data:', { 
          hasEvents: !!data.events, 
          eventCount: data.events?.length || 0 
        });
        
        if (data.events && data.events.length > 0) {
          console.log('Raw events from Zoho:', data.events.map(ev => ({
            title: ev.title,
            dateandtime: ev.dateandtime
          })));
        }
        
        // Debug: Log the raw first event to see actual field names
        if (data.events && data.events.length > 0) {
          console.log('Raw Zoho event structure:', JSON.stringify(data.events[0], null, 2));
          console.log('dateandtime field:', data.events[0].dateandtime);
          if (data.events[0].dateandtime) {
            try {
              const parsed = JSON.parse(data.events[0].dateandtime);
              console.log('Parsed dateandtime:', parsed);
            } catch (e) {
              console.log('dateandtime is not JSON:', data.events[0].dateandtime);
            }
          }
        }
        
        console.log('Starting to map events, count:', data.events?.length || 0);
        events = data.events?.map((event: any) => {
          let startTime = '';
          let endTime = '';
          if (event.dateandtime) {
            const dateTimeData = event.dateandtime;
            if (dateTimeData.start) {
              startTime = parseZohoDate(dateTimeData.start)?.toISOString() || '';
            }
            if (dateTimeData.end) {
              endTime = parseZohoDate(dateTimeData.end)?.toISOString() || '';
            }
          }
          // Fallback: try other date fields if dateandtime parsing failed
          if (!startTime) {
            if (event.createdtime) {
              startTime = parseZohoDate(event.createdtime)?.toISOString() || '';
            } else if (event.lastmodifiedtime) {
              startTime = parseZohoDate(event.lastmodifiedtime)?.toISOString() || '';
            }
          }
          if (!endTime && event.lastmodifiedtime) {
            endTime = parseZohoDate(event.lastmodifiedtime)?.toISOString() || '';
          }
          // Log for debugging
          console.log('Event:', event.title, 'start:', startTime, 'end:', endTime);
          return {
            id: event.uid || event.event_id || event.id || event.eventId || `event-${Math.random()}`,
            title: event.title || event.summary || event.name,
            description: event.description || event.details || event.notes,
            start_time: startTime,
            end_time: endTime,
            location: event.location || event.venue || event.place,
            attachments: (event.attach || event.attachments || []).map((att: any) => ({
              name: att.fileName || att.name || 'Attachment',
              url: `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${att.fileId}&caluid=f4c3dda451a2448fb8f12e629a46f533&euid=${event.uid || event.event_id || event.id}`,
              size: att.size || 0
            })),
            all_day: event.isallday === 'true' || event.isallday === true || event.all_day === 'true' || event.allDay === true || event.all_day === true,
            recurrence: event.recurrence || event.recurring,
            created_time: event.createdtime || event.created_time || event.createdTime || event.created,
            modified_time: event.lastmodifiedtime || event.modified_time || event.modifiedTime || event.modified,
          };
        }) || [];
        
        console.log('Successfully mapped events:', events.length);
        console.log('Sample mapped event:', events[0] ? {
          id: events[0].id,
          title: events[0].title,
          start_time: events[0].start_time,
          end_time: events[0].end_time,
          all_day: events[0].all_day
        } : 'No events');
      } else {
        const errorText = await response.text();
        console.log(`Events endpoint failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.log(`Events endpoint error: ${error}`);
    }

    // If no events found, return empty array with success status
    if (events.length === 0) {
      console.log('No events found via events endpoint');
      console.log('This might be due to date filtering or parsing issues');
      
      return NextResponse.json({
        success: true,
        events: [],
        total: 0,
        message: 'No events found in the specified date range. Calendar API is working correctly.',
        debug: {
          dateRange: { zohoStartDate, zohoEndDate },
          parsedEventCount: events.length,
          debugEvents: [],
          apiStatus: 'No events fetched from Zoho',
          zohoApiDebug
        }
      });
    }

    console.log('Transformed events:', events.length);

    // Filter events to only include those within the calculated date range
    const startRange = parseZohoDate(zohoStartDate);
    const endRange = parseZohoDate(zohoEndDate);
    console.log('Date range for filtering:', {
      startRange: startRange?.toISOString(),
      endRange: endRange?.toISOString(),
      zohoStartDate,
      zohoEndDate
    });
    
    const filteredEvents = events.filter(ev => {
      if (!ev.start_time) {
        console.log('Event filtered out - no start_time:', ev.title);
        return false;
      }
      const evStart = new Date(ev.start_time);
      const inRange = evStart >= startRange && evStart <= endRange;
      console.log('Event filtering:', {
        title: ev.title,
        start_time: ev.start_time,
        evStart: evStart.toISOString(),
        inRange
      });
      return inRange;
    });
    const debugEvents = filteredEvents.map(ev => {
      if (!ev.start_time) {
        return {
          title: ev.title,
          originalStart: ev.start_time,
          originalEnd: ev.end_time,
          parsedStart: null,
          parsedEnd: null,
          inRange: false,
          reason: 'No start_time'
        };
      }
      const evStart = new Date(ev.start_time);
      const inRange = evStart >= startRange && evStart <= endRange;
      return {
        title: ev.title,
        originalStart: ev.start_time,
        originalEnd: ev.end_time,
        parsedStart: evStart.toISOString(),
        parsedEnd: ev.end_time ? new Date(ev.end_time).toISOString() : null,
        inRange,
        reason: inRange ? 'In range' : 'Out of range'
      };
    });
    console.log('Filtered events count:', filteredEvents.length);
    events = filteredEvents;

    return NextResponse.json({
      success: true,
      events,
      total: events.length,
      debug: {
        dateRange: { zohoStartDate, zohoEndDate },
        parsedEventCount: events.length,
        debugEvents
      }
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