import { useEffect } from 'react';
import { supabaseClient } from '../api/supabaseClient';
import { useAppStore } from '../store/useAppStore';
import { omrLog } from '../utils/logger';

export const useRealtime = () => {
  const updateImportStatus = useAppStore((state) => state.updateImportStatus);

  useEffect(() => {
    omrLog('iniciando listener realtime', { context: 'SUPABASE' });
    const channel = supabaseClient
      .channel('realtime:avaliacoes')
      .on('broadcast', { event: 'process-update' }, (payload) => {
        const data = payload.payload as { id: string; status: string; message?: string };
        updateImportStatus(data.id, {
          status: data.status as 'pending' | 'processing' | 'completed' | 'failed',
          message: data.message
        });
      })
      .subscribe((status) => {
        omrLog(`canal realtime -> ${status}`, { context: 'SUPABASE' });
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [updateImportStatus]);
};
