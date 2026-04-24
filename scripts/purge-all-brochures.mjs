import { list, del } from '@vercel/blob';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

function loadDotEnvLocal() {
  try {
    const envRaw = readFileSync('.env.local', 'utf8');
    for (const line of envRaw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore
  }
}

async function listAllBlobsForPrefix(prefix) {
  const blobs = [];
  let cursor = undefined;

  while (true) {
    const result = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    if (!result.hasMore) break;
    cursor = result.cursor;
  }

  return blobs;
}

async function run() {
  loadDotEnvLocal();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL');
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  }

  const [brochureBlobs, documentBlobs] = await Promise.all([
    listAllBlobsForPrefix('training-brochures/'),
    listAllBlobsForPrefix('training-documents/'),
  ]);
  const allBlobs = [...brochureBlobs, ...documentBlobs];

  if (allBlobs.length > 0) {
    await del(allBlobs.map((blob) => blob.url));
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();
  try {
    await client.query(`
      UPDATE technical_trainings
      SET brochure_url = NULL,
          brochure_path = NULL,
          brochure_file_name = NULL,
          brochure_file_size = NULL,
          brochure_mime_type = NULL,
          brochure_updated_at = NOW(),
          updated_at = NOW()
    `);
    await client.query(`
      UPDATE non_technical_trainings
      SET brochure_url = NULL,
          brochure_path = NULL,
          brochure_file_name = NULL,
          brochure_file_size = NULL,
          brochure_mime_type = NULL,
          brochure_updated_at = NOW(),
          updated_at = NOW()
    `);
    await client.query(`
      UPDATE calendar_events
      SET attachments = '[]'::jsonb,
          updated_at = NOW()
    `);
  } finally {
    client.release();
    await pool.end();
  }

  console.log(
    JSON.stringify(
      {
        deleted_blob_files: allBlobs.length,
        reset_tables: ['technical_trainings', 'non_technical_trainings', 'calendar_events'],
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error('Purge all brochures failed:', error);
  process.exit(1);
});
