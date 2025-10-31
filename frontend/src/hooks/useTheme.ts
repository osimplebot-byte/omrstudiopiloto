import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { omrLog } from '../utils/logger';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme
  }));

  useEffect(() => {
    document.body.dataset.theme = theme;
    omrLog(`aplicando tema ${theme}`, { context: 'FRONT' });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
