import { NextRequest, NextResponse } from 'next/server';
import { updateCatalogRecord } from '@/app/lib/db/catalogRepository';
import { serverLogger } from '@/app/lib/logger';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

function isTrainingTable(value: string): value is TrainingTable {
  return value === 'technical_trainings' || value === 'non_technical_trainings';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const trainingTable = String(body.training_table || '').trim();
    const trainingId = String(body.training_id || '').trim();

    if (!isTrainingTable(trainingTable) || !trainingId) {
      return NextResponse.json(
        { error: 'training_table and training_id are required' },
        { status: 400 }
      );
    }

    const brochureUrl = String(body.brochure_url || '').trim();
    const brochurePath = String(body.brochure_path || '').trim();
    const brochureFileName = String(body.brochure_file_name || '').trim();
    const brochureFileSize = Number(body.brochure_file_size || 0);
    const brochureMimeType = String(body.brochure_mime_type || 'application/pdf').trim();

    if (!brochureUrl || !brochureFileName) {
      return NextResponse.json(
        { error: 'brochure_url and brochure_file_name are required' },
        { status: 400 }
      );
    }

    const { error } = await updateCatalogRecord(trainingTable, trainingId, {
      brochure_url: brochureUrl,
      brochure_path: brochurePath || null,
      brochure_file_name: brochureFileName,
      brochure_file_size: brochureFileSize || 0,
      brochure_mime_type: brochureMimeType,
      brochure_updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('Training brochure update error:', error);
    return NextResponse.json({ error: 'Failed to save brochure metadata' }, { status: 500 });
  }
}
