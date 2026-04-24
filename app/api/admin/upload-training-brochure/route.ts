import { NextRequest, NextResponse } from 'next/server';
import { uploadPublicFile } from '@/app/lib/storage/object-storage';
import { serverLogger } from '@/app/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 15MB' }, { status: 400 });
    }

    const uploaded = await uploadPublicFile(file, 'training-brochures');
    return NextResponse.json({
      url: uploaded.url,
      path: uploaded.pathname,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    });
  } catch (error) {
    serverLogger.error('Upload training brochure error:', error);
    return NextResponse.json({ error: 'Failed to upload brochure' }, { status: 500 });
  }
}
