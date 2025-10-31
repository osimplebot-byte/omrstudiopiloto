import { Suspense, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { useAppStore } from './store/useAppStore';
import { routes } from './router/routes';
import { useHashRoute } from './hooks/useHashRoute';
import { useRealtime } from './hooks/useRealtime';

const titles: Record<string, { title: string; subtitle: string }> = {
  dados: { title: 'Dados', subtitle: 'Upload e acompanhamento dos processos' },
  simulador: { title: 'Test-Drive', subtitle: 'Explore dados de demonstração' },
  conexoes: { title: 'Conexões', subtitle: 'Integrações e tokens de serviço' },
  ajuda: { title: 'Ajuda', subtitle: 'FAQ e suporte rápido' }
};

const App = () => {
  const view = useAppStore((state) => state.view);
  useHashRoute();
  useRealtime();

  const CurrentView = useMemo(() => routes[view].component, [view]);
  const headerContent = titles[view];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-shell__content">
        <Header title={headerContent.title} subtitle={headerContent.subtitle} />
        <Suspense fallback={<p>Carregando...</p>}>
          <CurrentView />
        </Suspense>
      </main>
    </div>
  );
};

export default App;
