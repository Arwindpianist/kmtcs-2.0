import { NextRequest, NextResponse } from 'next/server';
import { uploadPublicFile } from '@/app/lib/storage/object-storage';
import { serverLogger } from '@/app/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const blob = await uploadPublicFile(file, 'news-images');

    return NextResponse.json({
      url: blob.url,
      path: blob.pathname,
      bucket: 'vercel_blob',
    });
  } catch (error) {
    serverLogger.error('News image upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
