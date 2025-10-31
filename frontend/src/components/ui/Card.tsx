import { ReactNode } from 'react';
import { clsx } from 'clsx';

type CardVariant = 'default' | 'highlight' | 'muted';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  variant?: CardVariant;
}

export const Card = ({ title, subtitle, children, actions, className, variant = 'default' }: CardProps) => {
  return (
    <section className={clsx('card', variant !== 'default' && `card--${variant}`, className)}>
      {(title || actions) && (
        <header className="card__header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      <div className="card__content">{children}</div>
    </section>
  );
};
