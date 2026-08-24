import { runNeonQuery } from '@/app/lib/db/neon';

export type NewsBlockType = 'heading' | 'paragraph' | 'image';

export type NewsContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string };

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image_url: string | null;
  content_blocks: NewsContentBlock[];
  status: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type NewsCreateInput = {
  title: string;
  slug?: string;
  summary: string;
  cover_image_url?: string | null;
  content_blocks?: NewsContentBlock[];
  status?: boolean;
  published_at?: string | null;
};

export type NewsUpdateInput = Partial<NewsCreateInput> & { id: string };

let newsSchemaReady = false;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || `news-${Date.now()}`;
}

function normalizeBlocks(blocks: unknown): NewsContentBlock[] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .map((block): NewsContentBlock | null => {
      if (!block || typeof block !== 'object') return null;
      const item = block as Record<string, unknown>;
      const type = item.type;

      if (type === 'heading' && typeof item.text === 'string' && item.text.trim()) {
        return { type: 'heading', text: item.text.trim() };
      }
      if (type === 'paragraph' && typeof item.text === 'string' && item.text.trim()) {
        return { type: 'paragraph', text: item.text.trim() };
      }
      if (type === 'image' && typeof item.url === 'string' && item.url.trim()) {
        return {
          type: 'image',
          url: item.url.trim(),
          caption: typeof item.caption === 'string' ? item.caption.trim() : undefined,
        };
      }
      return null;
    })
    .filter((block): block is NewsContentBlock => block !== null);
}

function mapNewsRow(row: Record<string, unknown>): NewsRecord {
  let blocks: NewsContentBlock[] = [];
  const rawBlocks = row.content_blocks;

  if (typeof rawBlocks === 'string') {
    try {
      blocks = normalizeBlocks(JSON.parse(rawBlocks));
    } catch {
      blocks = [];
    }
  } else {
    blocks = normalizeBlocks(rawBlocks);
  }

  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    summary: String(row.summary ?? ''),
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    content_blocks: blocks,
    status: Boolean(row.status),
    published_at: String(row.published_at ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

export async function ensureNewsSchema() {
  if (newsSchemaReady) return;

  await runNeonQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await runNeonQuery(`
    CREATE TABLE IF NOT EXISTS news (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      cover_image_url TEXT,
      content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
      status BOOLEAN NOT NULL DEFAULT TRUE,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_news_status_published
      ON news (status, published_at DESC)
  `);
  await runNeonQuery(`
    CREATE INDEX IF NOT EXISTS idx_news_slug
      ON news (slug)
  `);

  newsSchemaReady = true;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug;
  let attempt = 1;

  while (true) {
    const values: unknown[] = [candidate];
    let sql = 'SELECT id FROM news WHERE slug = $1';
    if (excludeId) {
      values.push(excludeId);
      sql += ` AND id <> $${values.length}`;
    }
    sql += ' LIMIT 1';

    const existing = await runNeonQuery<{ id: string }>(sql, values);
    if (existing.rows.length === 0) {
      return candidate;
    }

    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
}

export async function listNews(params: {
  status?: string | null;
  search?: string | null;
  limit?: string | null;
  includeInactive?: boolean;
}) {
  await ensureNewsSchema();

  const values: unknown[] = [];
  const where: string[] = [];
  let sql = 'SELECT * FROM news';

  if (params.status !== null && params.status !== undefined && params.status !== '') {
    values.push(params.status === 'true');
    where.push(`status = $${values.length}`);
  } else if (!params.includeInactive) {
    values.push(true);
    where.push(`status = $${values.length}`);
  }

  if (params.search) {
    values.push(`%${params.search}%`);
    where.push(
      `(title ILIKE $${values.length} OR summary ILIKE $${values.length} OR slug ILIKE $${values.length})`
    );
  }

  if (where.length > 0) {
    sql += ` WHERE ${where.join(' AND ')}`;
  }

  sql += ' ORDER BY published_at DESC, created_at DESC';

  if (params.limit) {
    const parsedLimit = Number.parseInt(params.limit, 10);
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      values.push(parsedLimit);
      sql += ` LIMIT $${values.length}`;
    }
  }

  const result = await runNeonQuery<Record<string, unknown>>(sql, values);
  return result.rows.map(mapNewsRow);
}

export async function getNewsById(id: string) {
  await ensureNewsSchema();
  const result = await runNeonQuery<Record<string, unknown>>(
    'SELECT * FROM news WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0] ? mapNewsRow(result.rows[0]) : null;
}

export async function getNewsBySlug(slug: string, activeOnly = true) {
  await ensureNewsSchema();
  const values: unknown[] = [slug];
  let sql = 'SELECT * FROM news WHERE slug = $1';
  if (activeOnly) {
    values.push(true);
    sql += ` AND status = $${values.length}`;
  }
  sql += ' LIMIT 1';

  const result = await runNeonQuery<Record<string, unknown>>(sql, values);
  return result.rows[0] ? mapNewsRow(result.rows[0]) : null;
}

export async function createNews(input: NewsCreateInput) {
  await ensureNewsSchema();

  const title = input.title?.trim();
  const summary = input.summary?.trim();
  if (!title || !summary) {
    throw new Error('Title and summary are required');
  }

  const baseSlug = slugify(input.slug?.trim() || title);
  const slug = await ensureUniqueSlug(baseSlug);
  const contentBlocks = normalizeBlocks(input.content_blocks ?? []);
  const status = input.status ?? true;
  const publishedAt = input.published_at ? new Date(input.published_at) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error('Invalid published_at date');
  }

  const result = await runNeonQuery<Record<string, unknown>>(
    `
    INSERT INTO news (
      title,
      slug,
      summary,
      cover_image_url,
      content_blocks,
      status,
      published_at
    ) VALUES (
      $1, $2, $3, $4, $5::jsonb, $6, $7
    )
    RETURNING *
    `,
    [
      title,
      slug,
      summary,
      input.cover_image_url?.trim() || null,
      JSON.stringify(contentBlocks),
      status,
      publishedAt.toISOString(),
    ]
  );

  return mapNewsRow(result.rows[0]);
}

export async function updateNews(input: NewsUpdateInput) {
  await ensureNewsSchema();

  const existing = await getNewsById(input.id);
  if (!existing) {
    return null;
  }

  const title = input.title !== undefined ? input.title.trim() : existing.title;
  const summary = input.summary !== undefined ? input.summary.trim() : existing.summary;
  if (!title || !summary) {
    throw new Error('Title and summary are required');
  }

  let slug = existing.slug;
  if (input.slug !== undefined || input.title !== undefined) {
    const baseSlug = slugify((input.slug ?? title).trim() || title);
    slug = await ensureUniqueSlug(baseSlug, input.id);
  }

  const contentBlocks =
    input.content_blocks !== undefined
      ? normalizeBlocks(input.content_blocks)
      : existing.content_blocks;

  const status = input.status !== undefined ? Boolean(input.status) : existing.status;
  const coverImageUrl =
    input.cover_image_url !== undefined
      ? input.cover_image_url?.trim() || null
      : existing.cover_image_url;

  let publishedAt = existing.published_at;
  if (input.published_at !== undefined && input.published_at !== null) {
    const parsed = new Date(input.published_at);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error('Invalid published_at date');
    }
    publishedAt = parsed.toISOString();
  }

  const result = await runNeonQuery<Record<string, unknown>>(
    `
    UPDATE news
    SET
      title = $1,
      slug = $2,
      summary = $3,
      cover_image_url = $4,
      content_blocks = $5::jsonb,
      status = $6,
      published_at = $7,
      updated_at = NOW()
    WHERE id = $8
    RETURNING *
    `,
    [
      title,
      slug,
      summary,
      coverImageUrl,
      JSON.stringify(contentBlocks),
      status,
      publishedAt,
      input.id,
    ]
  );

  return result.rows[0] ? mapNewsRow(result.rows[0]) : null;
}

export async function deleteNews(id: string) {
  await ensureNewsSchema();
  await runNeonQuery('DELETE FROM news WHERE id = $1', [id]);
  return true;
}
