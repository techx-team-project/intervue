import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-on-primary disabled:bg-on-surface/12 disabled:text-on-surface/38',
  secondary: 'bg-primary-container text-on-primary-container disabled:bg-on-surface/12 disabled:text-on-surface/38',
  neutral: 'bg-surface-container-high text-on-surface disabled:bg-on-surface/12 disabled:text-on-surface/38',
  outline: 'border border-primary text-primary disabled:border-on-surface/12 disabled:text-on-surface/38',
  ghost: 'text-primary disabled:text-on-surface/38',
  danger: 'bg-error text-on-error disabled:bg-on-surface/12 disabled:text-on-surface/38',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-label-md gap-1.5',
  md: 'h-10 px-6 text-label-lg gap-2',
  lg: 'h-12 px-8 text-title-sm gap-2.5',
  xl: 'h-12 px-6 text-base font-semibold gap-2',
  '2xl': 'h-14 px-8 text-base font-semibold gap-2',
};

const radiusStyles: Record<NonNullable<ButtonProps['radius']>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

type ButtonStyleOptions = Pick<ButtonProps, 'variant' | 'size' | 'radius' | 'className'>;

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  radius = 'full',
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    'state-layer touch-target ease-standard inline-flex cursor-pointer whitespace-nowrap items-center justify-center transition-[color,background-color,transform] duration-150 select-none active:scale-[0.98] disabled:cursor-not-allowed',
    radiusStyles[radius],
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      radius = 'full',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'state-layer touch-target ease-standard inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-colors duration-150 select-none disabled:cursor-not-allowed',
          radiusStyles[radius],
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
