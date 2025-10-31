import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === 'updated' && event.query.state.status === 'error') {
    console.error('[OMR:QUERY] erro ao buscar dados', event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event?.type === 'updated' && event.mutation.state.status === 'error') {
    console.error('[OMR:QUERY] erro ao atualizar dados', event.mutation.state.error);
  }
});
