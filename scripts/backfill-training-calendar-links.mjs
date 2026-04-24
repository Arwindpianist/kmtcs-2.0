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

async function run() {
  loadDotEnvLocal();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Missing DATABASE_URL');

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    const result = await client.query(`
      INSERT INTO training_calendar_links (
        id,
        training_table,
        training_id,
        calendar_event_id,
        is_primary,
        created_at,
        updated_at
      )
      SELECT
        gen_random_uuid(),
        ce.training_snapshot->>'training_table' AS training_table,
        (ce.training_snapshot->>'training_id')::uuid AS training_id,
        ce.id AS calendar_event_id,
        false,
        NOW(),
        NOW()
      FROM calendar_events ce
      WHERE ce.training_snapshot IS NOT NULL
        AND ce.training_snapshot->>'training_id' IS NOT NULL
        AND ce.training_snapshot->>'training_table' IN ('technical_trainings', 'non_technical_trainings')
        AND NOT EXISTS (
          SELECT 1
          FROM training_calendar_links tcl
          WHERE tcl.calendar_event_id = ce.id
            AND tcl.training_id = (ce.training_snapshot->>'training_id')::uuid
            AND tcl.training_table = ce.training_snapshot->>'training_table'
        )
    `);

    console.log(
      JSON.stringify(
        {
          inserted_links: result.rowCount || 0,
          message:
            (result.rowCount || 0) > 0
              ? 'Backfilled missing training-calendar links from event training snapshots.'
              : 'No missing links found to backfill.',
        },
        null,
        2
      )
    );
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Backfill training-calendar links failed:', error);
  process.exit(1);
});
