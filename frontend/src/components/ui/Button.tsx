import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', loading, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(variantClasses[variant], className, loading && 'is-loading')}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? 'Processando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
