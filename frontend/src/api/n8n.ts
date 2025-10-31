import { omrLog } from '../utils/logger';

const webhookUrl = __OMR_ENV__.n8nWebhook;

export interface N8nPayload {
  event: string;
  data: Record<string, unknown>;
}

export const triggerN8n = async (payload: N8nPayload) => {
  if (!webhookUrl) {
    omrLog('Webhook N8N não configurado', { context: 'N8N' });
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error('[OMR:N8N] falha ao disparar webhook', response.status);
  }
};
