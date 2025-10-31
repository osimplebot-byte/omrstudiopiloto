export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const baseUrl = __OMR_ENV__.apiBaseUrl || 'http://localhost:8787';

const withDefaults = (options: ApiRequestOptions): RequestInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const request: RequestInit = {
    method: options.method ?? 'GET',
    headers,
    signal: options.signal
  };

  if (options.body !== undefined) {
    request.body = JSON.stringify(options.body);
  }

  return request;
};

export const apiFetch = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, withDefaults(options));

  if (!response.ok) {
    const detail = await response.text();
    console.error('[OMR:API] falha na chamada', path, response.status, detail);
    throw new Error(`Falha ao executar ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const apiClient = {
  importDados: (payload: unknown) =>
    apiFetch<{ processId: string }>('/api/dados/import', { method: 'POST', body: payload }),
  getInstanciaStatus: () => apiFetch<{ status: string }>('/api/instancia/status'),
  sendChat: (payload: unknown) => apiFetch<{ messageId: string }>('/api/chat/send', { method: 'POST', body: payload }),
  createTicket: (payload: unknown) => apiFetch<{ ticketId: string }>('/api/support/ticket', { method: 'POST', body: payload })
};
