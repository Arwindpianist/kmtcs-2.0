import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const eventId = searchParams.get('eventId');
    const calendarUid = searchParams.get('calendarUid');

    if (!fileId || !eventId || !calendarUid) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Test the original Zoho Mail URL that was working before
    const originalUrl = `https://mail.zoho.com/_zcl/zcal/attachment?mode=download&fileId=${fileId}&caluid=${calendarUid}&euid=${eventId}`;
    
    console.log('Testing original URL:', originalUrl);
    
    try {
      const response = await fetch(originalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const fileBuffer = await response.arrayBuffer();
        console.log('File size:', fileBuffer.byteLength);
        
        if (fileBuffer.byteLength > 0) {
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
              'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
            },
          });
        } else {
          return NextResponse.json(
            { error: 'File is empty', fileSize: fileBuffer.byteLength },
            { status: 404 }
          );
        }
      } else {
        const errorText = await response.text();
        return NextResponse.json(
          { 
            error: 'Download failed', 
            status: response.status, 
            statusText: response.statusText,
            errorText: errorText.substring(0, 500)
          },
          { status: response.status }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Network error', 
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test file download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test file download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
