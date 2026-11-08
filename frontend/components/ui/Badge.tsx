import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'vip';
  size?: 'sm' | 'md';
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-surface-container-high text-on-surface border-outline-variant',
  success: 'bg-primary-light text-primary border-primary/30',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-error/10 text-error border-error/30',
  info: 'bg-primary-light text-on-primary-container border-outline-variant',
  vip: 'bg-primary text-white font-bold shadow-sm',
};

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-bold',
        variantStyles[variant],
        sizeStyles[size],
        variant === 'vip' && 'border-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
