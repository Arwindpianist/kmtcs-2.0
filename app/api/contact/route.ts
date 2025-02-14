// // ignore this

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { google } from 'googleapis';
// import { Storage } from '@google-cloud/storage';

// type Data = {
//     message: string;
// };

// export const config = {
//     api: {
//         bodyParser: true, // Ensure body parsing is enabled
//     },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//     console.log('Request method:', req.method);
    
//     if (req.method === 'POST') {
//         const { name, email, company, message } = req.body;

//         console.log('Request body:', req.body);
        
//         if (!name || !email || !message) {
//             return res.status(400).json({ message: 'Name, email, and message are required.' });
//         }

//         try {
//             // Cloud Storage Configuration
//             const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
//             if (!bucketName) throw new Error('Bucket name not configured.');

//             const storage = new Storage();
//             const fileName = `contacts/${Date.now()}_${name}.json`;
//             const fileContent = JSON.stringify({ name, email, company, message }, null, 2);

//             const bucket = storage.bucket(bucketName);
//             const file = bucket.file(fileName);
//             await file.save(fileContent, { contentType: 'application/json' });
//             console.log(`Saved contact form submission to bucket: ${fileName}`);

//             // Gmail API Configuration
//             const oAuth2Client = new google.auth.OAuth2(
//                 process.env.GMAIL_CLIENT_ID,
//                 process.env.GMAIL_CLIENT_SECRET,
//                 process.env.GMAIL_REDIRECT_URI
//             );
//             oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

//             const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
//             const emailContent = `
// Reply-To: ${email}
// To: info@kmtcs.com.my
// Subject: New Contact Form Submission

// Name: ${name}
// Email: ${email}
// Company: ${company}
// Message:
// ${message}
//             `;

//             const base64EncodedEmail = Buffer.from(emailContent)
//                 .toString('base64')
//                 .replace(/\+/g, '-')
//                 .replace(/\//g, '_')
//                 .replace(/=+$/, '');

//             await gmail.users.messages.send({
//                 userId: 'me',
//                 requestBody: { raw: base64EncodedEmail },
//             });
//             console.log(`Email sent successfully for ${email}`);

//             res.status(200).json({ message: 'Form submitted successfully!' });
//         } catch (error) {
//             console.error('Error processing request:', error.message);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//     }
// }
