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

    // Try different OAuth scopes for calendar access
    const scopes = [
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.UPDATE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.DELETE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE,ZohoCalendar.events.UPDATE,ZohoCalendar.events.DELETE',
      'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ,ZohoCalendar.events.CREATE,ZohoCalendar.events.UPDATE,ZohoCalendar.events.DELETE,ZohoCalendar.events.ALL',
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
      message: 'Choose one of the authorization URLs below to get the correct scope:',
      authUrls: authUrls,
      instructions: [
        '1. Click on each authorization URL to test different scopes',
        '2. The first one that works will give you the correct scope',
        '3. Copy the authorization code from the callback',
        '4. Use the callback endpoint to exchange for tokens',
        '5. Update your environment variables with the new tokens'
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