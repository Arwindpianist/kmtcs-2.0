import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    
    if (!scope) {
      return NextResponse.json({
        error: 'Please provide a scope parameter',
        example: '/api/test-zoho-scopes?scope=ZohoCalendar.calendar.READ'
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