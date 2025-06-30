import { NextRequest, NextResponse } from 'next/server';
import { sendFormNotification } from '@/app/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Testing email with credentials:', {
      email: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
      passwordLength: (process.env.ZOHO_APP_PASSWORD || 'mell nrzo zybc dvys').length
    });
    
    // Send test email
    await sendFormNotification({
      name: body.name || 'Test User',
      email: body.email || 'test@example.com',
      phone: body.phone || '+60123456789',
      company: body.company || 'Test Company',
      message: body.message || 'This is a test email from the KMTCS website.',
      formType: 'Test Form'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      config: {
        email: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
        passwordConfigured: !!process.env.ZOHO_APP_PASSWORD
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 