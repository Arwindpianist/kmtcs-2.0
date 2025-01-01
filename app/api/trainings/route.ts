// app/api/trainings/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; // Path to your NextAuth options

export async function GET(request: Request) {
  // Get the session to fetch the access token
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'No access token found' }, { status: 403 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const { data } = await calendar.events.list({
      calendarId: 'admin@kmtcs.com.my',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json(data.items || []);
  } catch (error) {
    console.error('Error fetching calendar events', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
