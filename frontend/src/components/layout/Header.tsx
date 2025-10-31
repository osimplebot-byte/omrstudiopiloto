import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__titles">
        <h1 className="header__title">{title}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      <div className="header__actions">
        <span className="header__env">Ambiente demo</span>
        <Button variant="ghost" onClick={toggleTheme}>
          Tema: {theme === 'light' ? 'Claro' : 'Escuro'}
        </Button>
      </div>
    </header>
  );
};
