import { NextRequest, NextResponse } from 'next/server';
import {
  createCatalogRecord,
  deleteCatalogRecord,
  getCatalogRecordById,
  listCatalogRecords,
  updateCatalogRecord,
} from '@/app/lib/db/catalogRepository';
import {
  ensureCalendarSchema,
  getTrainingCalendarLinks,
  setTrainingCalendarLinks,
} from '@/app/lib/db/calendarRepository';
import { serverLogger } from '@/app/lib/logger';

type TrainingRecord = {
  id?: string;
  [key: string]: unknown;
};

async function attachCalendarLinks(
  data: TrainingRecord[] | TrainingRecord | null,
  isSingle: boolean
) {
  if (!data) return data;

  const records = Array.isArray(data) ? data : [data];
  const ids = records
    .map((record) => String(record.id || ''))
    .filter(Boolean);
  const linksByTraining = await getTrainingCalendarLinks('non_technical_trainings', ids);

  const merged = records.map((record) => {
    const recordId = String(record.id || '');
    const links = linksByTraining.get(recordId) || [];
    return {
      ...record,
      linked_event_ids: links.map((link) => link.calendar_event_id),
      next_event_start: links[0]?.start_time || null,
      next_event_title: links[0]?.title || null,
    };
  });

  return isSingle ? merged[0] : merged;
}

export async function GET(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    const { data, error } = id
      ? await getCatalogRecordById('non_technical_trainings', id)
      : await listCatalogRecords('non_technical_trainings', status, limit);

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch non-technical trainings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: await attachCalendarLinks(data, Boolean(id)) });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();
    const { linked_event_ids, ...trainingPayload } = body;
    
    const { data, error } = await createCatalogRecord('non_technical_trainings', trainingPayload);

    if (error) {
      const errorMeta = error as { message?: string; details?: string; hint?: string; code?: string };
      serverLogger.error('Supabase error:', error);
      serverLogger.error('Error details:', {
        message: errorMeta.message,
        details: errorMeta.details,
        hint: errorMeta.hint,
        code: errorMeta.code
      });
      return NextResponse.json(
        { error: 'Failed to create non-technical training', details: errorMeta.message },
        { status: 500 }
      );
    }

    if (data?.id && Array.isArray(linked_event_ids)) {
      await setTrainingCalendarLinks('non_technical_trainings', String(data.id), linked_event_ids);
    }

    return NextResponse.json({ data: await attachCalendarLinks(data, true) });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();
    const { id, linked_event_ids, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await updateCatalogRecord('non_technical_trainings', id, updateData);

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update non-technical training' },
        { status: 500 }
      );
    }

    if (Array.isArray(linked_event_ids)) {
      await setTrainingCalendarLinks('non_technical_trainings', id, linked_event_ids);
    }

    return NextResponse.json({ data: await attachCalendarLinks(data, true) });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await deleteCatalogRecord('non_technical_trainings', id);

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete non-technical training' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 