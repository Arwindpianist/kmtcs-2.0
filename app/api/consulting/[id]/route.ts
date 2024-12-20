import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getConsultingById } from '@/app/data/consulting';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }

    const service = getConsultingById(id);

    if (!service) {
      return NextResponse.json(
        { error: `Service not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error('Internal server error:', error?.message || error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
