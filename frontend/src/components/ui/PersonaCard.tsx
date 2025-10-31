interface PersonaCardProps {
  name: string;
  description: string;
  active?: boolean;
  onSelect?: () => void;
}

export const PersonaCard = ({ name, description, active, onSelect }: PersonaCardProps) => {
  return (
    <button type="button" className={`persona-card ${active ? 'persona-card--active' : ''}`} onClick={onSelect}>
      <strong>{name}</strong>
      <span>{description}</span>
    </button>
  );
};
