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

function isBlobUrl(url) {
  return typeof url === 'string' && url.includes('.public.blob.vercel-storage.com/');
}

async function isReachable(url) {
  if (!url) return false;
  if (!isBlobUrl(url)) return false;
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(3500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function run() {
  loadDotEnvLocal();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Missing DATABASE_URL');

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  let updated = 0;
  try {
    const missingTrainings = await client.query(`
      SELECT id, title, 'technical_trainings'::text AS training_table
      FROM technical_trainings
      WHERE brochure_url IS NULL
      UNION ALL
      SELECT id, title, 'non_technical_trainings'::text AS training_table
      FROM non_technical_trainings
      WHERE brochure_url IS NULL
    `);

    for (const training of missingTrainings.rows) {
      const linkedEvents = await client.query(
        `
        SELECT ce.attachments
        FROM training_calendar_links tcl
        INNER JOIN calendar_events ce ON ce.id = tcl.calendar_event_id
        WHERE tcl.training_table = $1
          AND tcl.training_id = $2::uuid
        ORDER BY ce.start_time DESC
        `,
        [training.training_table, training.id]
      );

      let chosen = null;
      for (const row of linkedEvents.rows) {
        const attachments = Array.isArray(row.attachments) ? row.attachments : [];
        for (const attachment of attachments) {
          const url = attachment?.url;
          if (!url) continue;
          const reachable = await isReachable(url);
          if (!reachable) continue;
          chosen = {
            url,
            name: attachment?.name || `${training.title}.pdf`,
            size: Number(attachment?.size || 0),
            path: url.split('.public.blob.vercel-storage.com/')[1] || null,
          };
          break;
        }
        if (chosen) break;
      }

      if (!chosen) continue;

      await client.query(
        `
        UPDATE ${training.training_table}
        SET brochure_url = $1,
            brochure_path = $2,
            brochure_file_name = $3,
            brochure_file_size = $4,
            brochure_mime_type = 'application/pdf',
            brochure_updated_at = NOW(),
            updated_at = NOW()
        WHERE id = $5::uuid
        `,
        [chosen.url, chosen.path, chosen.name, chosen.size, training.id]
      );
      updated += 1;
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log(JSON.stringify({ updated_trainings: updated }, null, 2));
}

run().catch((error) => {
  console.error('Backfill training brochures from events failed:', error);
  process.exit(1);
});
