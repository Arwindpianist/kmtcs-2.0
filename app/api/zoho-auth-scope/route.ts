import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.ZOHO_CLIENT_ID;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Zoho OAuth credentials not configured' },
        { status: 500 }
      );
    }

    // Try different OAuth scopes that are commonly used in Zoho
    const scopes = [
      // Basic calendar scopes
      'ZohoCalendar.calendar.READ',
      'ZohoCalendar.events.READ',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ',
      
      // Alternative calendar scopes
      'ZohoCalendar.calendar.ALL',
      'ZohoCalendar.events.ALL',
      'ZohoCalendar.calendar.ALL,ZohoCalendar.events.ALL',
      
      // Generic scopes that might work
      'ZohoCalendar.ALL',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.UPDATE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.DELETE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE,ZohoCalendar.events.UPDATE,ZohoCalendar.events.DELETE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE,ZohoCalendar.events.UPDATE,ZohoCalendar.events.DELETE,ZohoCalendar.events.ALL',
      
      // Try without ZohoCalendar prefix
      'calendar.READ',
      'events.READ',
      'calendar.READ,events.READ',
      'calendar.ALL',
      'events.ALL',
      'calendar.ALL,events.ALL',
      
      // Try with different casing
      'ZohoCalendar.Calendar.READ',
      'ZohoCalendar.Events.READ',
      'ZohoCalendar.Calendar.READ,ZohoCalendar.Events.READ',
      
      // Try with different separators
      'ZohoCalendar.calendar.READ ZohoCalendar.events.READ',
      'ZohoCalendar.calendar.READ;ZohoCalendar.events.READ',
      
      // Try minimal scope
      'ZohoCalendar',
      'calendar',
      'events',
    ];

    const authUrls = scopes.map(scope => {
      const params = new URLSearchParams({
        scope: scope,
        client_id: clientId,
        response_type: 'code',
        access_type: 'offline',
        redirect_uri: redirectUri,
      });
      
      return {
        scope: scope,
        url: `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Test these authorization URLs to find the correct scope:',
      totalScopes: scopes.length,
      authUrls: authUrls,
      instructions: [
        '1. Click on each authorization URL to test different scopes',
        '2. If you get an "Invalid OAuth Scope" error, try the next URL',
        '3. The first URL that works (shows Zoho login) will have the correct scope',
        '4. After successful authorization, copy the authorization code from the callback',
        '5. Use the callback endpoint to exchange for tokens',
        '6. Update your environment variables with the new tokens',
        '',
        'Note: Start with the first few URLs as they are most likely to work.'
      ]
    });

  } catch (error) {
    console.error('Auth scope error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URLs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 