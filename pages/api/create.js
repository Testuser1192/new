
import { createWebhook } from '../../lib/storage';

export default function handler(req, res) {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const id = createWebhook(email);
  const webhookUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/hooks/${id}`;
  res.status(200).json({ webhook: webhookUrl });
}
