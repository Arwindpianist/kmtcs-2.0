import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

function loadDotEnvLocal() {
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
}

async function run() {
  loadDotEnvLocal();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const latest = await client.query(`
      SELECT id, title, start_time, end_time, attachments, training_snapshot
      FROM calendar_events
      WHERE status = true
      ORDER BY created_at DESC
      LIMIT 5
    `);
    console.log('LATEST_EVENTS', JSON.stringify(latest.rows, null, 2));
    if (!latest.rows[0]) return;
    const eventId = latest.rows[0].id;
    const links = await client.query(
      `
      SELECT
        tcl.training_table,
        tcl.training_id,
        COALESCE(tt.brochure_url, ntt.brochure_url) AS brochure_url,
        COALESCE(tt.brochure_file_name, ntt.brochure_file_name) AS brochure_file_name
      FROM training_calendar_links tcl
      LEFT JOIN technical_trainings tt
        ON tcl.training_table = 'technical_trainings' AND tt.id = tcl.training_id
      LEFT JOIN non_technical_trainings ntt
        ON tcl.training_table = 'non_technical_trainings' AND ntt.id = tcl.training_id
      WHERE tcl.calendar_event_id = $1
      `,
      [eventId]
    );
    console.log('LATEST_EVENT_LINKS', JSON.stringify(links.rows, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
