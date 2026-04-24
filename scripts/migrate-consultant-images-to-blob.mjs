import { put } from '@vercel/blob';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

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
    // .env.local is optional in CI/hosted runs
  }
}

function getSafeExtension(url, contentType) {
  const fromPath = extname(new URL(url).pathname).replace('.', '').toLowerCase();
  if (fromPath && /^[a-z0-9]+$/.test(fromPath)) return fromPath;

  const typeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  const fromType = typeMap[(contentType || '').toLowerCase()];
  return fromType || 'bin';
}

async function run() {
  loadDotEnvLocal();

  const databaseUrl = process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL');
  }
  if (!blobToken) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT id, image_url
       FROM consultants
       WHERE image_url IS NOT NULL
         AND image_url ILIKE '%supabase.co/storage/%'`
    );

    if (!rows.length) {
      console.log('No Supabase consultant images found. Nothing to migrate.');
      return;
    }

    let migrated = 0;
    let failed = 0;

    for (const row of rows) {
      const consultantId = row.id;
      const sourceUrl = row.image_url;

      try {
        const response = await fetch(sourceUrl);
        if (!response.ok) {
          throw new Error(`Failed download (${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';
        const arrayBuffer = await response.arrayBuffer();
        const extension = getSafeExtension(sourceUrl, contentType);
        const key = `consultant-images/${Date.now()}-${consultantId}.${extension}`;

        const blob = await put(key, Buffer.from(arrayBuffer), {
          access: 'public',
          addRandomSuffix: false,
          token: blobToken,
          contentType: contentType || undefined,
        });

        await client.query('UPDATE consultants SET image_url = $1, updated_at = NOW() WHERE id = $2', [
          blob.url,
          consultantId,
        ]);

        migrated += 1;
        console.log(`Migrated ${consultantId} -> ${blob.url}`);
      } catch (error) {
        failed += 1;
        console.error(`Failed consultant ${consultantId}:`, error.message);
      }
    }

    console.log(`Migration complete. Migrated: ${migrated}, Failed: ${failed}`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
