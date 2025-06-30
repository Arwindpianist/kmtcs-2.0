import nodemailer from 'nodemailer';

interface EmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  formType?: string;
  serviceTitle?: string;
}

export async function sendFormNotification(data: EmailData) {
  // Try different SMTP configurations
  const smtpConfigs = [
    {
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
        pass: process.env.ZOHO_APP_PASSWORD || 'mell nrzo zybc dvys'
      }
    },
    {
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
        pass: process.env.ZOHO_APP_PASSWORD || 'mell nrzo zybc dvys'
      }
    },
    {
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
        pass: process.env.ZOHO_APP_PASSWORD || 'mell nrzo zybc dvys'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  ];

  let transporter;
  let lastError;

  // Try each configuration
  for (const config of smtpConfigs) {
    try {
      transporter = nodemailer.createTransport(config);
      
      // Verify the connection
      await transporter.verify();
      console.log('SMTP connection verified successfully');
      break;
    } catch (error) {
      console.log(`SMTP config failed:`, error);
      lastError = error;
      continue;
    }
  }

  if (!transporter) {
    console.error('All SMTP configurations failed:', lastError);
    return;
  }

  // Extract service title from message if it contains training/consulting inquiry
  let serviceTitle = data.serviceTitle;
  if (!serviceTitle && data.message.includes('Inquiry:')) {
    const lines = data.message.split('\n');
    for (const line of lines) {
      if (line.includes('Inquiry:')) {
        serviceTitle = line.split('Inquiry:')[1]?.trim();
        break;
      }
    }
  }

  const formType = data.formType || 'Contact Form';
  
  const emailContent = `
New ${formType} Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.company ? `- Company: ${data.company}` : ''}

Message:
${data.message}

Submitted at: ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
  `.trim();

  const mailOptions = {
    from: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
    to: process.env.ZOHO_EMAIL || 'info@kmtcs.com.my',
    subject: `New ${formType} Submission - ${data.name}${serviceTitle ? ` - ${serviceTitle}` : ''}`,
    text: emailContent,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
          New ${formType} Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        </div>
        
        ${serviceTitle ? `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">Service Information</h3>
          <p><strong>Service:</strong> ${serviceTitle}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>
        
        <div style="background-color: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #3730a3; font-size: 14px;">
            <strong>Submitted at:</strong> ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent automatically from the KMTCS website contact form.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error to avoid breaking the form submission
  }
} 