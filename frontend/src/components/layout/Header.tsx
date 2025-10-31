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
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header__actions">
        <span className="header__env">Demo</span>
        <Button variant="ghost" onClick={toggleTheme}>
          Tema: {theme === 'light' ? 'Claro' : 'Escuro'}
        </Button>
      </div>
    </header>
  );
};
