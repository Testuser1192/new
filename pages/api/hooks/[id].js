import nodemailer from 'nodemailer';
import { getEmailById } from '../../../lib/storage';

export default async function handler(req, res) {
  const { id } = req.query;
  const email = getEmailById(id);

  console.log('[DEBUG] Webhook triggered:', id);
  console.log('[DEBUG] Target email:', email);
  console.log('[DEBUG] Request body:', req.body);
  console.log('[DEBUG] SMTP Host:', process.env.SMTP_HOST);
  console.log('[DEBUG] SMTP Port:', process.env.SMTP_PORT);
  console.log('[DEBUG] SMTP User:', process.env.SMTP_USER);

  if (!email) {
    console.error('[ERROR] Webhook not found for ID:', id);
    return res.status(404).json({ error: 'Webhook not found' });
  }

  if (req.method !== 'POST') {
    console.error('[ERROR] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const payload = JSON.stringify(req.body, null, 2);

  try {
    const info = await transporter.sendMail({
      from: `Chatwize <chatgptpython@gmail.com>`, // Geverifieerde Gmail
      to: email,
      subject: 'Nieuwe webhook data',
      text: payload
    });

    console.log('[DEBUG] SMTP sendMail response:', info);
    res.status(200).json({ message: 'Email sent', data: req.body, smtpInfo: info });
  } catch (err) {
    console.error('[ERROR] Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
}
