import { NextRequest, NextResponse } from 'next/server';
import {
  createCalendarEvent,
  deleteCalendarEvent,
  ensureCalendarSchema,
  getCalendarEventById,
  getEventTrainings,
  listCalendarEvents,
  updateCalendarEvent,
} from '@/app/lib/db/calendarRepository';
import { serverLogger } from '@/app/lib/logger';

export async function GET(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const event = await getCalendarEventById(id);
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      const linkedTrainings = await getEventTrainings(id);
      return NextResponse.json({ data: { ...event, linked_trainings: linkedTrainings } });
    }

    const data = await listCalendarEvents({
      start: searchParams.get('start'),
      end: searchParams.get('end'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
    });
    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('Calendar events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();

    if (!body.title || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: 'title, start_time, and end_time are required' },
        { status: 400 }
      );
    }

    const data = await createCalendarEvent(body);
    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('Calendar events POST error:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();
    const { id, ...payload } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const data = await updateCalendarEvent(id, payload);
    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('Calendar events PUT error:', error);
    return NextResponse.json({ error: 'Failed to update calendar event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    await deleteCalendarEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('Calendar events DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete calendar event' }, { status: 500 });
  }
}
