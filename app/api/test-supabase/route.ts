import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'deprecated',
    message: 'Supabase has been removed. Use Neon-backed test routes instead.',
  });
} 