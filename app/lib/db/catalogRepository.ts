import { runNeonQuery } from '@/app/lib/db/neon';

export type CatalogTable = 'technical_trainings' | 'non_technical_trainings' | 'consulting_services';

type CatalogRecord = Record<string, unknown>;

const allowedColumns: Record<CatalogTable, Set<string>> = {
  technical_trainings: new Set([
    'title',
    'description',
    'duration',
    'price',
    'objectives',
    'course_contents',
    'target_audience',
    'methodology',
    'certification',
    'hrdcorp_approval_no',
    'service_type',
    'status',
    'image_url',
    'category',
    'brochure_url',
    'brochure_path',
    'brochure_file_name',
    'brochure_file_size',
    'brochure_mime_type',
    'brochure_updated_at',
  ]),
  non_technical_trainings: new Set([
    'title',
    'description',
    'duration',
    'price',
    'objectives',
    'course_contents',
    'target_audience',
    'methodology',
    'certification',
    'hrdcorp_approval_no',
    'status',
    'image_url',
    'category',
    'brochure_url',
    'brochure_path',
    'brochure_file_name',
    'brochure_file_size',
    'brochure_mime_type',
    'brochure_updated_at',
  ]),
  consulting_services: new Set([
    'title',
    'description',
    'duration',
    'price',
    'objectives',
    'service_contents',
    'target_audience',
    'methodology',
    'deliverables',
    'status',
    'image_url',
    'category',
  ]),
};

function sanitizePayload(table: CatalogTable, payload: CatalogRecord): CatalogRecord {
  const whitelist = allowedColumns[table];

  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => whitelist.has(key) && value !== undefined)
  );
}

export async function listCatalogRecords(table: CatalogTable, status: string | null, limit: string | null) {
  const values: unknown[] = [];
  const whereClauses: string[] = [];
  let sql = `SELECT * FROM ${table}`;

  if (status !== null) {
    values.push(status === 'true');
    whereClauses.push(`status = $${values.length}`);
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  sql += ' ORDER BY created_at DESC';

  if (limit !== null) {
    const parsedLimit = Number.parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit)) {
      values.push(parsedLimit);
      sql += ` LIMIT $${values.length}`;
    }
  }

  const result = await runNeonQuery<CatalogRecord>(sql, values);
  return { data: result.rows, error: null };
}

export async function getCatalogRecordById(table: CatalogTable, id: string) {
  const result = await runNeonQuery<CatalogRecord>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id]);
  return { data: result.rows[0] ?? null, error: null };
}

export async function createCatalogRecord(table: CatalogTable, payload: CatalogRecord) {
  const cleanPayload = sanitizePayload(table, payload);

  const entries = Object.entries(cleanPayload);
  if (entries.length === 0) {
    return { data: null, error: new Error('No valid fields provided for insert') };
  }

  const columns = entries.map(([key]) => `"${key}"`).join(', ');
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ');
  const values = entries.map(([, value]) => value);

  const result = await runNeonQuery<CatalogRecord>(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );

  return { data: result.rows[0] ?? null, error: null };
}

export async function updateCatalogRecord(table: CatalogTable, id: string, payload: CatalogRecord) {
  const cleanPayload = sanitizePayload(table, payload);

  const entries = Object.entries(cleanPayload);
  if (entries.length === 0) {
    return { data: null, error: new Error('No valid fields provided for update') };
  }

  const setClause = entries.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
  const values = entries.map(([, value]) => value);
  values.push(id);

  const result = await runNeonQuery<CatalogRecord>(
    `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`,
    values
  );

  return { data: result.rows[0] ?? null, error: null };
}

export async function deleteCatalogRecord(table: CatalogTable, id: string) {
  await runNeonQuery(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return { error: null };
}
