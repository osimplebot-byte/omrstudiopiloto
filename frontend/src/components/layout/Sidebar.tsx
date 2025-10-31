import { routes } from '../../router/routes';
import { useAppStore } from '../../store/useAppStore';
import { useHashRoute } from '../../hooks/useHashRoute';
import { Logo } from './Logo';

const navLabels: Record<keyof typeof routes, string> = {
  dados: 'Dados',
  simulador: 'Test-Drive',
  conexoes: 'Conexões',
  ajuda: 'Ajuda'
};

export const Sidebar = () => {
  const view = useAppStore((state) => state.view);
  const { navigate } = useHashRoute();

  return (
    <aside className="sidebar">
      <div className="sidebar__hero">
        <Logo />
        <div>
          <h1 className="sidebar__title">Preview da Experiência do Painel</h1>
          <p className="sidebar__description">
            Entenda a jornada do atendente virtual e valide os fluxos do MVP com dados reais ou de demonstração.
          </p>
        </div>
      </div>

      <section className="sidebar__card">
        <h2>Identidade Visual</h2>
        <p className="sidebar__card-text">Paleta oficial aplicada nos componentes principais do painel.</p>
        <div className="sidebar__swatches">
          <div className="sidebar__swatch sidebar__swatch--primary">
            <span className="sidebar__swatch-name">Neon Bloom</span>
            <span className="sidebar__swatch-value">#E84393</span>
          </div>
          <div className="sidebar__swatch sidebar__swatch--surface">
            <span className="sidebar__swatch-name">Light Room</span>
            <span className="sidebar__swatch-value">#FFF5FB</span>
          </div>
        </div>
      </section>

      <section className="sidebar__card">
        <h2>Lembretes rápidos</h2>
        <ul className="sidebar__notes">
          <li>Tokens de serviço expiram a cada 90 dias.</li>
          <li>Checklist de deploy atualizado junto ao N8N.</li>
          <li>Logs [OMR] agrupados por contexto no painel.</li>
        </ul>
      </section>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        <span className="sidebar__nav-label">Acessar páginas</span>
        {Object.entries(routes).map(([id, config]) => {
          const label = navLabels[id as keyof typeof routes] ?? config.hash.replace('#/', '').toUpperCase();

          return (
            <button
              key={id}
              type="button"
              className={`sidebar__link ${view === id ? 'is-active' : ''}`}
              onClick={() => navigate(id as typeof view)}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <footer className="sidebar__footer">MVP • Ambiente Demo</footer>
    </aside>
  );
};
