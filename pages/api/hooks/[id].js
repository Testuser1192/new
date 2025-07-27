
import nodemailer from 'nodemailer';
import { getEmailById } from '../../../lib/storage';

export default async function handler(req, res) {
  const { id } = req.query;
  const email = getEmailById(id);
  if (!email) return res.status(404).json({ error: 'Webhook not found' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const payload = JSON.stringify(req.body, null, 2);

  try {
    await transporter.sendMail({
      from: `Webhook App <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Nieuwe webhook data',
      text: payload
    });
    res.status(200).json({ message: 'Email sent', data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
