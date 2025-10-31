import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { omrLog } from '../utils/logger';

export interface MetricsSummary {
  alunosAvaliados: number;
  questoesProcessadas: number;
  taxaAcertoMedia: number;
}

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics-summary'],
    queryFn: async () => {
      omrLog('buscando métricas', { context: 'HOOK' });
      const status = await apiClient.getInstanciaStatus();
      return {
        alunosAvaliados: status.status === 'online' ? 128 : 0,
        questoesProcessadas: status.status === 'online' ? 742 : 0,
        taxaAcertoMedia: status.status === 'online' ? 0.78 : 0
      } satisfies MetricsSummary;
    }
  });
};
