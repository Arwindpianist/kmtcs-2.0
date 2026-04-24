import { NextRequest, NextResponse } from 'next/server';
import { sendFormNotification } from '@/app/lib/emailService';
import { runNeonQuery } from '@/app/lib/db/neon';

type ContactSubmissionRecord = Record<string, unknown>;

const contactColumns = new Set([
  'name',
  'email',
  'phone',
  'company',
  'message',
  'status',
  'created_at',
  'updated_at',
]);

function sanitizeContactPayload(payload: ContactSubmissionRecord) {
  return Object.fromEntries(Object.entries(payload).filter(([key, value]) => contactColumns.has(key) && value !== undefined));
}

export async function GET(request: NextRequest) {
  try {
    const result = await runNeonQuery<ContactSubmissionRecord>('SELECT * FROM contact_submissions ORDER BY created_at DESC');
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
    const payload = sanitizeContactPayload(body);
    const entries = Object.entries(payload);
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No valid contact submission fields provided' }, { status: 400 });
    }

    const columns = entries.map(([key]) => `"${key}"`).join(', ');
    const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);

    const result = await runNeonQuery<ContactSubmissionRecord>(
      `INSERT INTO contact_submissions (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    // Send email notification
    await sendFormNotification({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      message: body.message,
      formType: 'Contact Form'
    });

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

    const payload = sanitizeContactPayload(updateData);
    const entries = Object.entries(payload);
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No valid contact submission fields provided' }, { status: 400 });
    }

    const setClause = entries.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);
    values.push(id);

    const result = await runNeonQuery<ContactSubmissionRecord>(
      `UPDATE contact_submissions SET ${setClause} WHERE id = $${values.length} RETURNING *`,
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

    await runNeonQuery('DELETE FROM contact_submissions WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 