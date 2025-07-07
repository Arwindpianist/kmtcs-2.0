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

    // Zoho Calendar API endpoint
    const calendarUid = 'f4c3dda451a2448fb8f12e629a46f533';
    const apiUrl = `https://calendar.zoho.com/api/v1/calendars/${calendarUid}/events`;
    
    // Get access token using helper function
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      console.error('Failed to obtain Zoho access token');
      return NextResponse.json(
        { error: 'Calendar API authentication failed' },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}?date_from=${startDate}&date_to=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    const events = data.events?.map((event: any) => ({
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
    // First, try to use existing access token if it's still valid
    const existingToken = process.env.ZOHO_ACCESS_TOKEN;
    if (existingToken) {
      return existingToken;
    }

    // If no existing token or it's expired, use refresh token
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    if (!refreshToken) {
      console.error('No refresh token configured');
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
      throw new Error('Failed to refresh token');
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;

  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
} 