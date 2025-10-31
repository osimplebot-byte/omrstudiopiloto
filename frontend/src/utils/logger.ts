interface LogOptions {
  context: 'FRONT' | 'API' | 'SUPABASE' | 'N8N' | 'STATE' | 'HOOK';
  data?: Record<string, unknown>;
}

export const omrLog = (message: string, options: LogOptions) => {
  const payload = options.data ? ` ${JSON.stringify(options.data)}` : '';
  console.info(`[OMR:${options.context}] ${message}${payload}`);
};

export const omrError = (message: string, error: unknown, options: LogOptions) => {
  console.error(`[OMR:${options.context}] ${message}`, error);
};
