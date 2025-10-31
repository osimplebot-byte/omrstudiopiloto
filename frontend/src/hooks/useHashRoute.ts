import { useEffect } from 'react';
import { resolveRoute, routes } from '../router/routes';
import { useAppStore } from '../store/useAppStore';
import { omrLog } from '../utils/logger';

export const useHashRoute = () => {
  const { setView } = useAppStore((state) => ({ setView: state.setView }));

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/dados';
      const view = resolveRoute(hash);
      omrLog(`navegação -> ${view}`, { context: 'FRONT' });
      setView(view);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setView]);

  const navigate = (view: keyof typeof routes) => {
    const { hash } = routes[view];
    window.location.hash = hash;
  };

  return { navigate };
};
