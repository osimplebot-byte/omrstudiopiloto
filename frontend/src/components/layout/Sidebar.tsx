import { routes } from '../../router/routes';
import { useAppStore } from '../../store/useAppStore';
import { useHashRoute } from '../../hooks/useHashRoute';

export const Sidebar = () => {
  const view = useAppStore((state) => state.view);
  const { navigate } = useHashRoute();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span>Omr Studio</span>
      </div>
      <nav className="sidebar__nav">
        {Object.entries(routes).map(([id, config]) => (
          <button
            key={id}
            type="button"
            className={`sidebar__link ${view === id ? 'is-active' : ''}`}
            onClick={() => navigate(id as typeof view)}
          >
            {config.hash.replace('#/', '').toUpperCase()}
          </button>
        ))}
      </nav>
      <footer className="sidebar__footer">MVP • Ambiente Demo</footer>
    </aside>
  );
};
