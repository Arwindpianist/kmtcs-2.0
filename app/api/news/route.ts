import { NextRequest, NextResponse } from 'next/server';
import {
  createNews,
  deleteNews,
  getNewsById,
  getNewsBySlug,
  listNews,
  updateNews,
} from '@/app/lib/db/newsRepository';
import { serverLogger } from '@/app/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    if (id) {
      const item = await getNewsById(id);
      if (!item) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }
      return NextResponse.json({ data: item });
    }

    if (slug) {
      const item = await getNewsBySlug(slug, !includeInactive);
      if (!item) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }
      return NextResponse.json({ data: item });
    }

    const rows = await listNews({
      status,
      search,
      limit,
      includeInactive,
    });

    return NextResponse.json({ data: rows });
  } catch (error) {
    serverLogger.error('News GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createNews({
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      cover_image_url: body.cover_image_url,
      content_blocks: body.content_blocks,
      status: body.status,
      published_at: body.published_at,
    });

    return NextResponse.json({ data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('required') || message.includes('Invalid') ? 400 : 500;
    serverLogger.error('News POST error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await updateNews({
      id: body.id,
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      cover_image_url: body.cover_image_url,
      content_blocks: body.content_blocks,
      status: body.status,
      published_at: body.published_at,
    });

    if (!updated) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('required') || message.includes('Invalid') ? 400 : 500;
    serverLogger.error('News PUT error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteNews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('News DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
