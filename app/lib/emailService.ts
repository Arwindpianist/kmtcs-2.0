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

function getSmtpConfigs() {
  return [
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
}

async function createVerifiedTransporter() {
  const smtpConfigs = getSmtpConfigs();
  let transporter;
  let lastError;

  for (const config of smtpConfigs) {
    try {
      transporter = nodemailer.createTransport(config);
      await transporter.verify();
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!transporter) {
    throw lastError || new Error('Failed to create SMTP transporter');
  }

  return transporter;
}

export async function sendFormNotification(data: EmailData) {
  let transporter;
  try {
    transporter = await createVerifiedTransporter();
  } catch (error) {
    console.error('All SMTP configurations failed:', error);
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

Submitted at: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' })}
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
            <strong>Submitted at:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' })}
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

export async function sendPasswordResetEmail({
  toEmail,
  resetUrl,
  expiresInMinutes,
}: {
  toEmail: string;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  let transporter;
  try {
    transporter = await createVerifiedTransporter();
  } catch (error) {
    console.error('SMTP unavailable for password reset email:', error);
    return;
  }

  const fromEmail = process.env.ZOHO_EMAIL || 'info@kmtcs.com.my';

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: 'KMTCS Password Reset Link',
      text: `You requested a password reset.\n\nUse this link to set a new password:\n${resetUrl}\n\nThis link expires in ${expiresInMinutes} minutes.\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Reset your KMTCS password</h2>
          <p>You requested a password reset for your account.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
              Reset Password
            </a>
          </p>
          <p style="word-break: break-all;">If the button does not work, copy and paste this link:<br/>${resetUrl}</p>
          <p>This link expires in <strong>${expiresInMinutes} minutes</strong>.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}