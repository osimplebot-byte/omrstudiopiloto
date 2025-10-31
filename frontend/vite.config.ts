import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __OMR_ENV__: JSON.stringify({
        supabaseUrl: env.VITE_SUPABASE_URL,
        apiBaseUrl: env.VITE_API_BASE_URL,
        n8nWebhook: env.VITE_N8N_WEBHOOK
      })
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
