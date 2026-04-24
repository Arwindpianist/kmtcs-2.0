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

const attachmentHealthCache = new Map<string, { ok: boolean; checkedAt: number }>();
const ATTACHMENT_HEALTH_TTL_MS = 5 * 60 * 1000;

function isBlobUrl(url: string) {
  return url.includes('.public.blob.vercel-storage.com/');
}

async function isAttachmentReachable(url: string) {
  if (!url) return false;

  // Only preflight-check Blob URLs we control; keep other attachments unchanged.
  if (!isBlobUrl(url)) return true;

  const cached = attachmentHealthCache.get(url);
  const now = Date.now();
  if (cached && now - cached.checkedAt < ATTACHMENT_HEALTH_TTL_MS) {
    return cached.ok;
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(3500),
    });
    const ok = response.ok;
    attachmentHealthCache.set(url, { ok, checkedAt: now });
    return ok;
  } catch {
    attachmentHealthCache.set(url, { ok: false, checkedAt: now });
    return false;
  }
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
    const eventsWithAttachments = eventsRaw.map((event) => {
      const linkedBrochures = attachmentMap.get(event.id) || [];
      const mergedAttachments = [...linkedBrochures, ...(event.attachments || [])].filter(
        (attachment, index, array) =>
          Boolean(attachment?.url) &&
          index === array.findIndex((candidate) => candidate.url === attachment.url)
      );
      return { event, mergedAttachments };
    });

    const validatedAttachmentBatches = await Promise.all(
      eventsWithAttachments.map(async ({ mergedAttachments }) => {
        const reachability = await Promise.all(
          mergedAttachments.map(async (attachment) => ({
            attachment,
            ok: await isAttachmentReachable(attachment.url),
          }))
        );
        return reachability.filter((item) => item.ok).map((item) => item.attachment);
      })
    );

    const events: CalendarEvent[] = eventsWithAttachments.map(({ event }, index) => {
      return {
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        duration: event.duration || undefined,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || undefined,
        attachments: validatedAttachmentBatches[index] || [],
        all_day: event.all_day,
        recurrence: undefined,
        training_snapshot: event.training_snapshot || undefined,
        created_time: event.created_at,
        modified_time: event.updated_at,
      };
    });

    return NextResponse.json(
      {
        success: true,
        events,
        total: events.length,
        message:
          events.length === 0
            ? 'No events found in the selected date range.'
            : undefined,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
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