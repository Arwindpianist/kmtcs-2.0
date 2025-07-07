import { NextRequest, NextResponse } from 'next/server';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
  expires_at: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, grant_type = 'authorization_code' } = body;

    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Zoho OAuth credentials not configured' },
        { status: 500 }
      );
    }

    let tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    let postData: any = {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    };

    if (grant_type === 'authorization_code') {
      if (!code) {
        return NextResponse.json(
          { error: 'Authorization code is required' },
          { status: 400 }
        );
      }
      postData.code = code;
      postData.grant_type = 'authorization_code';
    } else if (grant_type === 'refresh_token') {
      const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'Refresh token not configured' },
          { status: 500 }
        );
      }
      postData.refresh_token = refreshToken;
      postData.grant_type = 'refresh_token';
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Zoho token exchange error:', errorText);
      return NextResponse.json(
        { error: 'Failed to exchange token', details: errorText },
        { status: response.status }
      );
    }

    const tokenData: TokenResponse = await response.json();

    // Store the refresh token for future use
    if (tokenData.refresh_token) {
      console.log('New refresh token received:', tokenData.refresh_token);
      // In production, you should store this securely in your database
    }

    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    });

  } catch (error) {
    console.error('Zoho auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to get a valid access token
export async function getValidAccessToken(): Promise<string | null> {
  try {
    // First, try to use existing access token if it's still valid
    const existingToken = process.env.ZOHO_ACCESS_TOKEN;
    if (existingToken) {
      return existingToken;
    }

    // If no existing token or it's expired, use refresh token
    const response = await fetch('/api/zoho-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'refresh_token' }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.access_token;

  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
} 