import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { runNeonQuery } from '@/app/lib/db/neon';
import { serverLogger } from '@/app/lib/logger';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

type TrainingRow = {
  id: string;
  title: string;
  brochure_url: string | null;
  brochure_path: string | null;
  brochure_file_name: string | null;
  brochure_file_size: number | null;
  brochure_mime_type: string | null;
  updated_at: string | null;
  table_name: TrainingTable;
};

async function listAllBlobsForPrefix(prefix: string) {
  const blobs: Array<{
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
    etag: string;
  }> = [];
  let cursor: string | undefined;

  while (true) {
    const result = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    if (!result.hasMore) break;
    cursor = result.cursor;
  }

  return blobs;
}

async function loadState() {
  const [technical, nonTechnical, blobBrochures, blobDocuments] = await Promise.all([
    runNeonQuery<Omit<TrainingRow, 'table_name'>>(
      `
      SELECT id, title, brochure_url, brochure_path, brochure_file_name, brochure_file_size, brochure_mime_type, updated_at
      FROM technical_trainings
      ORDER BY created_at DESC
      `
    ),
    runNeonQuery<Omit<TrainingRow, 'table_name'>>(
      `
      SELECT id, title, brochure_url, brochure_path, brochure_file_name, brochure_file_size, brochure_mime_type, updated_at
      FROM non_technical_trainings
      ORDER BY created_at DESC
      `
    ),
    listAllBlobsForPrefix('training-brochures/'),
    listAllBlobsForPrefix('training-documents/'),
  ]);

  const trainings: TrainingRow[] = [
    ...technical.rows.map((row) => ({ ...row, table_name: 'technical_trainings' as const })),
    ...nonTechnical.rows.map((row) => ({ ...row, table_name: 'non_technical_trainings' as const })),
  ];

  const referenced = new Set<string>();
  for (const row of trainings) {
    if (row.brochure_url) referenced.add(row.brochure_url);
    if (row.brochure_path) referenced.add(row.brochure_path);
  }

  const missingTrainings = trainings.filter((row) => !row.brochure_url);
  const allBrochureBlobs = [...blobBrochures, ...blobDocuments];
  const unlinkedBlobs = allBrochureBlobs.filter(
    (blob) => !referenced.has(blob.url) && !referenced.has(blob.pathname)
  );

  const byEtag = new Map<string, typeof allBrochureBlobs>();
  for (const blob of allBrochureBlobs) {
    const listForEtag = byEtag.get(blob.etag) || [];
    listForEtag.push(blob);
    byEtag.set(blob.etag, listForEtag);
  }

  const duplicateGroups = [...byEtag.entries()]
    .filter(([, blobs]) => blobs.length > 1)
    .map(([etag, blobs]) => ({ etag, blobs }));

  return {
    trainings,
    missingTrainings,
    blobs: allBrochureBlobs,
    unlinkedBlobs,
    duplicateGroups,
  };
}

export async function GET() {
  try {
    const state = await loadState();
    return NextResponse.json({ data: state });
  } catch (error) {
    serverLogger.error('Brochure reconciliation GET error:', error);
    return NextResponse.json({ error: 'Failed to load brochure reconciliation data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action || '').trim();

    if (action === 'linkBrochure') {
      const trainingTable = String(body.training_table || '') as TrainingTable;
      const trainingId = String(body.training_id || '').trim();
      const blobUrl = String(body.blob_url || '').trim();
      const fileName = String(body.file_name || '').trim();

      if (
        (trainingTable !== 'technical_trainings' && trainingTable !== 'non_technical_trainings') ||
        !trainingId ||
        !blobUrl
      ) {
        return NextResponse.json(
          { error: 'training_table, training_id, and blob_url are required' },
          { status: 400 }
        );
      }

      const state = await loadState();
      const blob = state.blobs.find((item) => item.url === blobUrl);
      if (!blob) {
        return NextResponse.json({ error: 'Blob not found in training-brochures' }, { status: 404 });
      }

      const inferredFileName =
        fileName ||
        decodeURIComponent(blob.pathname.split('/').pop() || 'Training Brochure.pdf');

      await runNeonQuery(
        `
        UPDATE ${trainingTable}
        SET
          brochure_url = $1,
          brochure_path = $2,
          brochure_file_name = $3,
          brochure_file_size = $4,
          brochure_mime_type = 'application/pdf',
          brochure_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = $5
        `,
        [blob.url, blob.pathname, inferredFileName, blob.size, trainingId]
      );

      return NextResponse.json({ success: true });
    }

    if (action === 'cleanupDuplicateBlobs') {
      const state = await loadState();
      const referenced = new Set<string>();
      for (const training of state.trainings) {
        if (training.brochure_url) referenced.add(training.brochure_url);
        if (training.brochure_path) referenced.add(training.brochure_path);
      }

      const toDelete: string[] = [];
      for (const group of state.duplicateGroups) {
        const referencedInGroup = group.blobs.filter(
          (blob) => referenced.has(blob.url) || referenced.has(blob.pathname)
        );
        const unreferencedInGroup = group.blobs.filter(
          (blob) => !referenced.has(blob.url) && !referenced.has(blob.pathname)
        );

        if (referencedInGroup.length > 0) {
          toDelete.push(...unreferencedInGroup.map((blob) => blob.url));
        } else if (unreferencedInGroup.length > 1) {
          const sorted = [...unreferencedInGroup].sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
          toDelete.push(...sorted.slice(1).map((blob) => blob.url));
        }
      }

      if (toDelete.length > 0) {
        await del(toDelete);
      }

      return NextResponse.json({ success: true, deleted: toDelete.length });
    }

    if (action === 'deleteUnlinkedBlob') {
      const blobUrl = String(body.blob_url || '').trim();
      if (!blobUrl) {
        return NextResponse.json({ error: 'blob_url is required' }, { status: 400 });
      }

      const state = await loadState();
      const referenced = new Set<string>();
      for (const training of state.trainings) {
        if (training.brochure_url) referenced.add(training.brochure_url);
        if (training.brochure_path) referenced.add(training.brochure_path);
      }
      if (referenced.has(blobUrl)) {
        return NextResponse.json({ error: 'Cannot delete a linked brochure blob' }, { status: 400 });
      }

      await del(blobUrl);
      return NextResponse.json({ success: true });
    }

    if (action === 'purgeAllBrochures') {
      const state = await loadState();
      const allBlobUrls = state.blobs.map((blob) => blob.url);

      if (allBlobUrls.length > 0) {
        await del(allBlobUrls);
      }

      await runNeonQuery(`
        UPDATE technical_trainings
        SET brochure_url = NULL,
            brochure_path = NULL,
            brochure_file_name = NULL,
            brochure_file_size = NULL,
            brochure_mime_type = NULL,
            brochure_updated_at = NOW(),
            updated_at = NOW()
      `);
      await runNeonQuery(`
        UPDATE non_technical_trainings
        SET brochure_url = NULL,
            brochure_path = NULL,
            brochure_file_name = NULL,
            brochure_file_size = NULL,
            brochure_mime_type = NULL,
            brochure_updated_at = NOW(),
            updated_at = NOW()
      `);

      await runNeonQuery(`
        UPDATE calendar_events
        SET attachments = '[]'::jsonb,
            updated_at = NOW()
      `);

      return NextResponse.json({
        success: true,
        deleted_blobs: allBlobUrls.length,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    serverLogger.error('Brochure reconciliation POST error:', error);
    return NextResponse.json({ error: 'Failed to perform brochure reconciliation action' }, { status: 500 });
  }
}
