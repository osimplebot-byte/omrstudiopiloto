import { createClient } from '@supabase/supabase-js';
import { omrLog } from '../utils/logger';

const supabaseUrl = __OMR_ENV__.supabaseUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl) {
  omrLog('URL do Supabase ausente, verifique variáveis de ambiente', { context: 'SUPABASE' });
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});
