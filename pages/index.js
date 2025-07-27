
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  async function createWebhook() {
    const res = await fetch(`/api/create?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setWebhookUrl(data.webhook);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Maak jouw webhook</h1>
      <input
        type="email"
        placeholder="Voer je e-mail in"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', marginRight: '10px', width: '250px' }}
      />
      <button onClick={createWebhook} style={{ padding: '10px 20px' }}>
        Genereer Webhook
      </button>
      {webhookUrl && (
        <div style={{ marginTop: '20px' }}>
          <strong>Jouw Webhook URL:</strong>
          <div style={{ background: '#eee', padding: '10px', marginTop: '10px' }}>
            {webhookUrl}
          </div>
        </div>
      )}
    </div>
  );
}
