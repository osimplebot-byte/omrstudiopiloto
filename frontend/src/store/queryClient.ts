import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('[OMR:QUERY] erro ao buscar dados', error);
      }
    },
    mutations: {
      onError: (error) => {
        console.error('[OMR:QUERY] erro ao atualizar dados', error);
      }
    }
  }
});
