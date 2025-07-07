import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json(
        { error: 'Authorization failed', details: error },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code received' },
        { status: 400 }
      );
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.ZOHO_CLIENT_ID || '',
        client_secret: process.env.ZOHO_CLIENT_SECRET || '',
        redirect_uri: process.env.ZOHO_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code', details: errorText },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();

    // Return the tokens (in production, you should store these securely)
    return NextResponse.json({
      success: true,
      message: 'Authorization successful!',
      tokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      },
      instructions: [
        '1. Copy the refresh_token value above',
        '2. Add it to your .env.local file as ZOHO_REFRESH_TOKEN',
        '3. You can also add the access_token as ZOHO_ACCESS_TOKEN for immediate use',
        '4. The refresh token will be used to automatically get new access tokens',
      ]
    });

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 