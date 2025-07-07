import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const testAll = searchParams.get('testAll') === 'true';
    
    if (!scope && !testAll) {
      return NextResponse.json({
        error: 'Please provide a scope parameter or testAll=true',
        examples: [
          '/api/test-zoho-scopes?scope=ZohoCalendar.calendar.READ',
          '/api/test-zoho-scopes?testAll=true'
        ]
      }, { status: 400 });
    }

    const clientId = process.env.ZOHO_CLIENT_ID;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Zoho OAuth credentials not configured' },
        { status: 500 }
      );
    }

    if (testAll) {
      // Test multiple scopes at once - including the correct Zoho Calendar scopes
      const scopes = [
        // Correct Zoho Calendar scopes (singular 'event')
        'ZohoCalendar.event.ALL',
        'ZohoCalendar.event.READ',
        'ZohoCalendar.event.CREATE',
        'ZohoCalendar.event.UPDATE',
        'ZohoCalendar.event.DELETE',
        'ZohoCalendar.event.READ,ZohoCalendar.event.CREATE',
        'ZohoCalendar.event.READ,ZohoCalendar.event.UPDATE',
        'ZohoCalendar.event.READ,ZohoCalendar.event.DELETE',
        'ZohoCalendar.event.READ,ZohoCalendar.event.CREATE,ZohoCalendar.event.UPDATE,ZohoCalendar.event.DELETE',
        
        // Calendar scopes
        'ZohoCalendar.calendar.ALL',
        'ZohoCalendar.calendar.READ',
        'ZohoCalendar.calendar.CREATE',
        'ZohoCalendar.calendar.UPDATE',
        'ZohoCalendar.calendar.DELETE',
        
        // Combined scopes
        'ZohoCalendar.calendar.READ,ZohoCalendar.event.READ',
        'ZohoCalendar.calendar.ALL,ZohoCalendar.event.ALL',
        'ZohoCalendar.ALL',
        
        // Alternative formats (plural 'events')
        'ZohoCalendar.events.ALL',
        'ZohoCalendar.events.READ',
        'ZohoCalendar.calendar.READ,ZohoCalendar.events.READ',
        
        // Generic scopes
        'calendar.READ',
        'events.READ',
        'calendar.READ,events.READ',
        'calendar.ALL',
        'events.ALL',
        'calendar.ALL,events.ALL',
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
        message: 'Test these scopes to find which ones work:',
        scopes: authUrls,
        instructions: [
          '1. Click on each URL to test the scope',
          '2. If you see a Zoho login page, that scope is valid',
          '3. If you get "Invalid OAuth Scope", try the next one',
          '4. After successful login, you\'ll get an authorization code',
          '5. Use that code with the callback endpoint to get tokens'
        ]
      });
    }

    // Create authorization URL for the specific scope
    const params = new URLSearchParams({
      scope: scope,
      client_id: clientId,
      response_type: 'code',
      access_type: 'offline',
      redirect_uri: redirectUri,
    });
    
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;

    return NextResponse.json({
      success: true,
      scope: scope,
      authUrl: authUrl,
      instructions: [
        `1. Click the authUrl above to test scope: "${scope}"`,
        '2. If you see a Zoho login page, this scope is valid',
        '3. If you get an "Invalid OAuth Scope" error, try a different scope',
        '4. After successful login, you\'ll be redirected with an authorization code',
        '5. Use that code with the callback endpoint to get tokens'
      ]
    });

  } catch (error) {
    console.error('Test scope error:', error);
    return NextResponse.json(
      { error: 'Failed to test scope', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 