import { runNeonQuery } from '@/app/lib/db/neon';

export type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

export interface TrainingSnapshot {
  training_id?: string;
  training_table?: TrainingTable;
  title?: string;
  description?: string;
  duration?: string;
  objectives?: string[];
  course_contents?: string;
  target_audience?: string;
  methodology?: string;
  certification?: string;
  hrdcorp_approval_no?: string;
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  all_day: boolean;
  status: boolean;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  training_snapshot: TrainingSnapshot | null;
  created_at: string;
  updated_at: string;
}

type LinkRow = {
  training_id: string;
  calendar_event_id: string;
  start_time: string;
  title: string;
};

type EventBrochureRow = {
  calendar_event_id: string;
  brochure_file_name: string | null;
  brochure_url: string | null;
  brochure_file_size: number | null;
};

let calendarSchemaReady = false;

export async function ensureCalendarSchema() {
  if (calendarSchemaReady) return;

  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      duration TEXT,
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      location TEXT,
      all_day BOOLEAN NOT NULL DEFAULT FALSE,
      status BOOLEAN NOT NULL DEFAULT TRUE,
      attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
      training_snapshot JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await runNeonQuery(`
    ALTER TABLE calendar_events
      ADD COLUMN IF NOT EXISTS duration TEXT,
      ADD COLUMN IF NOT EXISTS training_snapshot JSONB
  `);

  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS training_calendar_links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      training_table TEXT NOT NULL CHECK (training_table IN ('technical_trainings', 'non_technical_trainings')),
      training_id UUID NOT NULL,
      calendar_event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
      is_primary BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (training_table, training_id, calendar_event_id)
    )
  `);

  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_calendar_events_start_status
      ON calendar_events (start_time, status)
  `);
  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_training_calendar_links_training
      ON training_calendar_links (training_table, training_id)
  `);
  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_training_calendar_links_event
      ON training_calendar_links (calendar_event_id)
  `);

  await runNeonQuery(`
    ALTER TABLE technical_trainings
      ADD COLUMN IF NOT EXISTS brochure_url TEXT,
      ADD COLUMN IF NOT EXISTS brochure_path TEXT,
      ADD COLUMN IF NOT EXISTS brochure_file_name TEXT,
      ADD COLUMN IF NOT EXISTS brochure_file_size BIGINT,
      ADD COLUMN IF NOT EXISTS brochure_mime_type TEXT,
      ADD COLUMN IF NOT EXISTS brochure_updated_at TIMESTAMPTZ
  `);

  await runNeonQuery(`
    ALTER TABLE non_technical_trainings
      ADD COLUMN IF NOT EXISTS brochure_url TEXT,
      ADD COLUMN IF NOT EXISTS brochure_path TEXT,
      ADD COLUMN IF NOT EXISTS brochure_file_name TEXT,
      ADD COLUMN IF NOT EXISTS brochure_file_size BIGINT,
      ADD COLUMN IF NOT EXISTS brochure_mime_type TEXT,
      ADD COLUMN IF NOT EXISTS brochure_updated_at TIMESTAMPTZ
  `);

  calendarSchemaReady = true;
}

export async function listCalendarEvents(params: {
  start?: string | null;
  end?: string | null;
  status?: string | null;
  search?: string | null;
  limit?: string | null;
}) {
  await ensureCalendarSchema();

  const values: unknown[] = [];
  const where: string[] = [];
  let sql = `
    SELECT
      ce.*,
      COUNT(tcl.id)::int AS linked_trainings_count
    FROM calendar_events ce
    LEFT JOIN training_calendar_links tcl
      ON tcl.calendar_event_id = ce.id
  `;

  if (params.start) {
    values.push(params.start);
    where.push(`ce.end_time >= $${values.length}::timestamptz`);
  }
  if (params.end) {
    values.push(params.end);
    where.push(`ce.start_time <= $${values.length}::timestamptz`);
  }
  if (params.status !== null && params.status !== undefined) {
    values.push(params.status === 'true');
    where.push(`ce.status = $${values.length}`);
  }
  if (params.search) {
    values.push(`%${params.search}%`);
    where.push(`(ce.title ILIKE $${values.length} OR COALESCE(ce.description, '') ILIKE $${values.length})`);
  }

  if (where.length > 0) {
    sql += ` WHERE ${where.join(' AND ')}`;
  }

  sql += ' GROUP BY ce.id ORDER BY ce.start_time ASC';

  if (params.limit) {
    const parsedLimit = Number.parseInt(params.limit, 10);
    if (!Number.isNaN(parsedLimit)) {
      values.push(parsedLimit);
      sql += ` LIMIT $${values.length}`;
    }
  }

  const result = await runNeonQuery<CalendarEventRecord & { linked_trainings_count: number }>(sql, values);
  return result.rows;
}

export async function getCalendarEventById(id: string) {
  await ensureCalendarSchema();
  const result = await runNeonQuery<CalendarEventRecord>(
    'SELECT * FROM calendar_events WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createCalendarEvent(payload: {
  title: string;
  description?: string | null;
  duration?: string | null;
  start_time: string;
  end_time: string;
  location?: string | null;
  all_day?: boolean;
  status?: boolean;
  attachments?: unknown;
  training_snapshot?: TrainingSnapshot | null;
}) {
  await ensureCalendarSchema();
  const result = await runNeonQuery<CalendarEventRecord>(
    `
    INSERT INTO calendar_events (
      title, description, duration, start_time, end_time, location, all_day, status, attachments, training_snapshot
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::jsonb, '[]'::jsonb), $10::jsonb)
    RETURNING *
    `,
    [
      payload.title,
      payload.description ?? null,
      payload.duration ?? null,
      payload.start_time,
      payload.end_time,
      payload.location ?? null,
      payload.all_day ?? false,
      payload.status ?? true,
      payload.attachments ? JSON.stringify(payload.attachments) : null,
      payload.training_snapshot ? JSON.stringify(payload.training_snapshot) : null,
    ]
  );
  return result.rows[0];
}

export async function updateCalendarEvent(
  id: string,
  payload: Partial<{
    title: string;
    description: string | null;
    duration: string | null;
    start_time: string;
    end_time: string;
    location: string | null;
    all_day: boolean;
    status: boolean;
    attachments: unknown;
    training_snapshot: TrainingSnapshot | null;
  }>
) {
  await ensureCalendarSchema();

  const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return getCalendarEventById(id);
  }

  const values: unknown[] = [];
  const setClause = entries
    .map(([key, value], index) => {
      values.push(
        (key === 'attachments' || key === 'training_snapshot') && value !== null
          ? JSON.stringify(value)
          : value
      );
      if (key === 'attachments') {
        return `"${key}" = COALESCE($${index + 1}::jsonb, '[]'::jsonb)`;
      }
      if (key === 'training_snapshot') {
        return `"${key}" = $${index + 1}::jsonb`;
      }
      return `"${key}" = $${index + 1}`;
    })
    .join(', ');

  values.push(id);

  const result = await runNeonQuery<CalendarEventRecord>(
    `
    UPDATE calendar_events
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *
    `,
    values
  );

  return result.rows[0] ?? null;
}

export async function deleteCalendarEvent(id: string) {
  await ensureCalendarSchema();
  await runNeonQuery('DELETE FROM calendar_events WHERE id = $1', [id]);
}

export async function setTrainingCalendarLinks(trainingTable: TrainingTable, trainingId: string, eventIds: string[]) {
  await ensureCalendarSchema();

  await runNeonQuery(
    'DELETE FROM training_calendar_links WHERE training_table = $1 AND training_id = $2',
    [trainingTable, trainingId]
  );

  for (const [index, eventId] of eventIds.entries()) {
    await runNeonQuery(
      `
      INSERT INTO training_calendar_links (training_table, training_id, calendar_event_id, is_primary)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (training_table, training_id, calendar_event_id) DO NOTHING
      `,
      [trainingTable, trainingId, eventId, index === 0]
    );
  }
}

export async function getTrainingCalendarLinks(trainingTable: TrainingTable, trainingIds: string[]) {
  await ensureCalendarSchema();
  if (trainingIds.length === 0) {
    return new Map<string, LinkRow[]>();
  }

  const result = await runNeonQuery<LinkRow>(
    `
    SELECT
      tcl.training_id,
      tcl.calendar_event_id,
      ce.start_time,
      ce.title
    FROM training_calendar_links tcl
    INNER JOIN calendar_events ce ON ce.id = tcl.calendar_event_id
    WHERE tcl.training_table = $1 AND tcl.training_id = ANY($2::uuid[])
    ORDER BY ce.start_time ASC
    `,
    [trainingTable, trainingIds]
  );

  const links = new Map<string, LinkRow[]>();
  for (const row of result.rows) {
    if (!links.has(row.training_id)) {
      links.set(row.training_id, []);
    }
    links.get(row.training_id)!.push(row);
  }
  return links;
}

export async function getEventTrainings(eventId: string) {
  await ensureCalendarSchema();
  const result = await runNeonQuery<{
    training_table: TrainingTable;
    training_id: string;
    title: string;
  }>(
    `
    SELECT
      tcl.training_table,
      tcl.training_id,
      CASE
        WHEN tcl.training_table = 'technical_trainings' THEN tt.title
        WHEN tcl.training_table = 'non_technical_trainings' THEN ntt.title
        ELSE ''
      END AS title
    FROM training_calendar_links tcl
    LEFT JOIN technical_trainings tt
      ON tcl.training_table = 'technical_trainings' AND tt.id = tcl.training_id
    LEFT JOIN non_technical_trainings ntt
      ON tcl.training_table = 'non_technical_trainings' AND ntt.id = tcl.training_id
    WHERE tcl.calendar_event_id = $1
    `,
    [eventId]
  );
  return result.rows;
}

export async function getEventBrochureAttachments(eventIds: string[]) {
  await ensureCalendarSchema();
  if (eventIds.length === 0) {
    return new Map<string, Array<{ name: string; url: string; size: number }>>();
  }

  const result = await runNeonQuery<EventBrochureRow>(
    `
    SELECT
      tcl.calendar_event_id,
      COALESCE(tt.brochure_file_name, ntt.brochure_file_name) AS brochure_file_name,
      COALESCE(tt.brochure_url, ntt.brochure_url) AS brochure_url,
      COALESCE(tt.brochure_file_size, ntt.brochure_file_size) AS brochure_file_size
    FROM training_calendar_links tcl
    LEFT JOIN technical_trainings tt
      ON tcl.training_table = 'technical_trainings' AND tt.id = tcl.training_id
    LEFT JOIN non_technical_trainings ntt
      ON tcl.training_table = 'non_technical_trainings' AND ntt.id = tcl.training_id
    WHERE tcl.calendar_event_id = ANY($1::uuid[])
    `,
    [eventIds]
  );

  const mapped = new Map<string, Array<{ name: string; url: string; size: number }>>();

  for (const row of result.rows) {
    if (!row.brochure_url) continue;
    if (!mapped.has(row.calendar_event_id)) {
      mapped.set(row.calendar_event_id, []);
    }
    mapped.get(row.calendar_event_id)!.push({
      name: row.brochure_file_name || 'Training Brochure.pdf',
      url: row.brochure_url,
      size: Number(row.brochure_file_size || 0),
    });
  }

  return mapped;
}
