import { NextRequest, NextResponse } from 'next/server';
import {
  ensureCalendarSchema,
  getTrainingCalendarLinks,
  setTrainingCalendarLinks,
} from '@/app/lib/db/calendarRepository';
import type { TrainingTable } from '@/app/lib/db/calendarRepository';
import { serverLogger } from '@/app/lib/logger';

function isTrainingTable(value: string): value is TrainingTable {
  return value === 'technical_trainings' || value === 'non_technical_trainings';
}

export async function GET(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const { searchParams } = new URL(request.url);
    const trainingTable = searchParams.get('training_table');
    const trainingIdsRaw = searchParams.get('training_ids');

    if (!trainingTable || !isTrainingTable(trainingTable)) {
      return NextResponse.json({ error: 'Invalid training_table' }, { status: 400 });
    }

    const trainingIds = (trainingIdsRaw || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const links = await getTrainingCalendarLinks(trainingTable, trainingIds);
    return NextResponse.json({
      data: Object.fromEntries(links.entries()),
    });
  } catch (error) {
    serverLogger.error('Training calendar links GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();
    const { training_table, training_id, event_ids } = body;

    if (!isTrainingTable(training_table)) {
      return NextResponse.json({ error: 'Invalid training_table' }, { status: 400 });
    }
    if (!training_id) {
      return NextResponse.json({ error: 'training_id is required' }, { status: 400 });
    }
    if (!Array.isArray(event_ids)) {
      return NextResponse.json({ error: 'event_ids must be an array' }, { status: 400 });
    }

    await setTrainingCalendarLinks(training_table, training_id, event_ids);
    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('Training calendar links POST error:', error);
    return NextResponse.json({ error: 'Failed to update links' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureCalendarSchema();
    const body = await request.json();
    const { training_table, training_id } = body;

    if (!isTrainingTable(training_table)) {
      return NextResponse.json({ error: 'Invalid training_table' }, { status: 400 });
    }
    if (!training_id) {
      return NextResponse.json({ error: 'training_id is required' }, { status: 400 });
    }

    await setTrainingCalendarLinks(training_table, training_id, []);
    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('Training calendar links DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove links' }, { status: 500 });
  }
}
