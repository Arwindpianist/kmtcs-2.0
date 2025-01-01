import { google } from 'googleapis';

export async function fetchTrainings(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const calendarId = 'info@kmtcs.com.my'; // Your calendar ID

  const { data } = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return (
    data.items?.map((event) => ({
      id: event.id!,
      title: event.summary || 'No Title',
      date: event.start?.date || event.start?.dateTime || 'Unknown Date',
      duration: 'N/A', // Replace with logic if event duration is defined
    })) || []
  );
}
