import type { ButtonHTMLAttributes } from 'react';

const VARIANT_CLASS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
} as const;

const SIZE_CLASS = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASS;
type ButtonSize = keyof typeof SIZE_CLASS;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) => {
  const classNames = [
    'btn',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classNames} {...rest}>
      {children}
    </button>
  );
};
