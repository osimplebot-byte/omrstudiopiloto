import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from './store/queryClient';

const container = document.getElementById('root');

if (!container) {
  console.error('[OMR:FRONT] container root não encontrado');
  throw new Error('Elemento #root é obrigatório.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
