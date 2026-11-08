import { cn } from '@/lib/utils';
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'outlined' | 'filled';
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  outlined: 'bg-surface border border-outline-variant',
  filled: 'bg-surface-container-low',
};

export function Card({ className, variant = 'outlined', ...props }: CardProps) {
  return <div className={cn('rounded-shape-lg', variantStyles[variant], className)} {...props} />;
}

export default Card;
