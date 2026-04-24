import { NextRequest, NextResponse } from 'next/server';
import { runNeonQuery } from '@/app/lib/db/neon';

type ConsultantRecord = Record<string, unknown>;

const consultantColumns = new Set([
  'name',
  'role',
  'image_url',
  'short_bio',
  'full_bio',
  'academic_qualifications',
  'professional_certifications',
  'career_experiences',
  'status',
  'created_at',
  'updated_at',
]);

function sanitizeConsultantPayload(payload: ConsultantRecord) {
  return Object.fromEntries(Object.entries(payload).filter(([key, value]) => consultantColumns.has(key) && value !== undefined));
}

export async function GET(request: NextRequest) {
  try {
    const result = await runNeonQuery<ConsultantRecord>('SELECT * FROM consultants ORDER BY created_at DESC');
    return NextResponse.json({ data: result.rows || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = sanitizeConsultantPayload(body);
    const entries = Object.entries(payload);
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No valid consultant fields provided' }, { status: 400 });
    }

    const columns = entries.map(([key]) => `"${key}"`).join(', ');
    const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);

    const result = await runNeonQuery<ConsultantRecord>(
      `INSERT INTO consultants (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return NextResponse.json({ data: result.rows[0] ?? null });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const payload = sanitizeConsultantPayload(updateData);
    const entries = Object.entries(payload);
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No valid consultant fields provided' }, { status: 400 });
    }

    const setClause = entries.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);
    values.push(id);

    const result = await runNeonQuery<ConsultantRecord>(
      `UPDATE consultants SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    return NextResponse.json({ data: result.rows[0] ?? null });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await runNeonQuery('DELETE FROM consultants WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 