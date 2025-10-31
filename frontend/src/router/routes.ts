import type { ViewId } from '../store/useAppStore';
import ViewDados from '../views/viewDados';
import ViewSimulador from '../views/viewSimulador';
import ViewConexoes from '../views/viewConexoes';
import ViewAjuda from '../views/viewAjuda';

export const routes: Record<ViewId, { hash: `#${string}`; component: React.FC }> = {
  dados: { hash: '#/dados', component: ViewDados },
  simulador: { hash: '#/simulador', component: ViewSimulador },
  conexoes: { hash: '#/conexoes', component: ViewConexoes },
  ajuda: { hash: '#/ajuda', component: ViewAjuda }
};

export const resolveRoute = (hash: string): ViewId => {
  const entry = Object.entries(routes).find(([, value]) => value.hash === hash);
  if (entry) {
    return entry[0] as ViewId;
  }
  return 'dados';
};
