import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { runNeonQuery } from '@/app/lib/db/neon';
import { serverLogger } from '@/app/lib/logger';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

interface LegacyBrochureRow {
  id: string;
  title: string | null;
  brochure_url: string | null;
}

function getSafePdfName(input: string) {
  const fallback = 'training-brochure.pdf';
  const trimmed = input.trim();
  if (!trimmed) return fallback;
  const sanitized = trimmed.replace(/[^a-zA-Z0-9.\-_ ]/g, '').replace(/\s+/g, '-');
  if (sanitized.toLowerCase().endsWith('.pdf')) return sanitized;
  return `${sanitized}.pdf`;
}

async function migrateTable(table: TrainingTable) {
  const sourceRows = await runNeonQuery<LegacyBrochureRow>(
    `
    SELECT id, title, brochure_url
    FROM ${table}
    WHERE brochure_url IS NOT NULL
      AND brochure_url ILIKE '%supabase.co/storage/%'
    `
  );

  let migrated = 0;
  let failed = 0;

  for (const row of sourceRows.rows) {
    const sourceUrl = row.brochure_url;
    if (!sourceUrl) continue;

    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Source download failed (${response.status})`);
      }

      const contentType = response.headers.get('content-type') || 'application/pdf';
      const blobData = Buffer.from(await response.arrayBuffer());
      const fileName = getSafePdfName(row.title || `brochure-${row.id}`);
      const key = `training-brochures/${table}/${Date.now()}-${row.id}.pdf`;

      const uploaded = await put(key, blobData, {
        access: 'public',
        addRandomSuffix: false,
        contentType,
      });

      await runNeonQuery(
        `
        UPDATE ${table}
        SET
          brochure_url = $1,
          brochure_path = $2,
          brochure_file_name = $3,
          brochure_file_size = $4,
          brochure_mime_type = $5,
          brochure_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = $6
        `,
        [uploaded.url, uploaded.pathname, fileName, blobData.length, contentType, row.id]
      );

      migrated += 1;
    } catch (error) {
      failed += 1;
      serverLogger.error(`Legacy brochure migration failed for ${table}:${row.id}`, error);
    }
  }

  return {
    table,
    found: sourceRows.rows.length,
    migrated,
    failed,
  };
}

export async function POST() {
  try {
    const [technical, nonTechnical] = await Promise.all([
      migrateTable('technical_trainings'),
      migrateTable('non_technical_trainings'),
    ]);

    return NextResponse.json({
      data: {
        technical,
        nonTechnical,
        totalFound: technical.found + nonTechnical.found,
        totalMigrated: technical.migrated + nonTechnical.migrated,
        totalFailed: technical.failed + nonTechnical.failed,
      },
    });
  } catch (error) {
    serverLogger.error('Legacy brochure migration error:', error);
    return NextResponse.json({ error: 'Failed to migrate legacy brochures' }, { status: 500 });
  }
}
