import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { triggerN8n } from '../api/n8n';
import { useAppStore } from '../store/useAppStore';
import { omrLog, omrError } from '../utils/logger';

interface UploadParams {
  fileName: string;
  payload: unknown;
}

export const useUpload = () => {
  const registerImport = useAppStore((state) => state.registerImport);
  const updateImportStatus = useAppStore((state) => state.updateImportStatus);

  return useMutation({
    mutationFn: async ({ fileName, payload }: UploadParams) => {
      omrLog(`iniciando upload ${fileName}`, { context: 'HOOK' });
      const result = await apiClient.importDados(payload);
      registerImport({
        id: result.processId,
        fileName,
        receivedAt: new Date().toISOString(),
        status: 'pending'
      });
      triggerN8n({ event: 'dados.import', data: { processId: result.processId } });
      return result.processId;
    },
    onSuccess: (processId) => {
      omrLog(`upload ${processId} aceito`, { context: 'FRONT' });
      updateImportStatus(processId, { status: 'processing' });
    },
    onError: (error) => {
      omrError('upload falhou', error, { context: 'FRONT' });
    }
  });
};
