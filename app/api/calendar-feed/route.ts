import { NextResponse } from 'next/server';
import { listCalendarEvents } from '@/app/lib/db/calendarRepository';
import { serverLogger } from '@/app/lib/logger';

function toIcsDate(dateInput: string, allDay: boolean) {
  const date = new Date(dateInput);
  if (allDay) {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export async function GET() {
  try {
    const events = await listCalendarEvents({
      start: new Date().toISOString(),
      status: 'true',
      limit: '500',
    });

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KMTCS//Training Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    for (const event of events) {
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${event.id}@kmtcs.com.my`);
      lines.push(`DTSTAMP:${toIcsDate(event.updated_at, false)}`);
      if (event.all_day) {
        lines.push(`DTSTART;VALUE=DATE:${toIcsDate(event.start_time, true)}`);
        lines.push(`DTEND;VALUE=DATE:${toIcsDate(event.end_time, true)}`);
      } else {
        lines.push(`DTSTART:${toIcsDate(event.start_time, false)}`);
        lines.push(`DTEND:${toIcsDate(event.end_time, false)}`);
      }
      lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
      if (event.description) {
        lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
      }
      if (event.location) {
        lines.push(`LOCATION:${escapeIcsText(event.location)}`);
      }
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');

    return new NextResponse(lines.join('\r\n'), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="kmtcs-training-calendar.ics"',
      },
    });
  } catch (error) {
    serverLogger.error('Calendar feed error:', error);
    return NextResponse.json({ error: 'Failed to generate calendar feed' }, { status: 500 });
  }
}
