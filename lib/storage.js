
const webhooks = {};

export function createWebhook(email) {
  const id = Math.random().toString(36).substring(2, 10);
  webhooks[id] = email;
  return id;
}

export function getEmailById(id) {
  return webhooks[id];
}
