import { clsx } from 'clsx';
import { ViewId } from '../../store/useAppStore';

interface TabProps {
  id: ViewId;
  label: string;
  active: boolean;
  onSelect: (id: ViewId) => void;
}

export const Tab = ({ id, label, active, onSelect }: TabProps) => {
  return (
    <button
      type="button"
      className={clsx('tab', active && 'tab--active')}
      onClick={() => onSelect(id)}
    >
      {label}
    </button>
  );
};
