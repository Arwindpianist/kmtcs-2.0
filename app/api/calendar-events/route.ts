import { NextRequest, NextResponse } from 'next/server';
import { getEventBrochureAttachments, listCalendarEvents } from '@/app/lib/db/calendarRepository';
import { serverLogger } from '@/app/lib/logger';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  duration?: string;
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
  training_snapshot?: {
    title?: string;
    description?: string;
    duration?: string;
    objectives?: string[];
    course_contents?: string;
    target_audience?: string;
    methodology?: string;
    certification?: string;
    hrdcorp_approval_no?: string;
  };
  created_time: string;
  modified_time: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const eventsRaw = await listCalendarEvents({
      start: `${startDate}T00:00:00.000Z`,
      end: `${endDate}T23:59:59.999Z`,
      status: 'true',
    });
    const attachmentMap = await getEventBrochureAttachments(eventsRaw.map((event) => event.id));
    const events: CalendarEvent[] = eventsRaw.map((event) => {
      const linkedBrochures = attachmentMap.get(event.id) || [];
      return {
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        duration: event.duration || undefined,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || undefined,
        attachments: [...(event.attachments || []), ...linkedBrochures],
        all_day: event.all_day,
        recurrence: undefined,
        training_snapshot: event.training_snapshot || undefined,
        created_time: event.created_at,
        modified_time: event.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      events,
      total: events.length,
      message:
        events.length === 0
          ? 'No events found in the selected date range.'
          : undefined,
    });
  } catch (error) {
    serverLogger.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}