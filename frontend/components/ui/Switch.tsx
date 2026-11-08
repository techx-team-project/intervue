'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  className?: string;
}

export function Switch({ checked, onChange, disabled = false, size = 'md', ariaLabel, className }: SwitchProps) {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        isSm ? 'h-5 w-9' : 'h-6 w-11',
        checked ? 'bg-primary' : 'bg-slate-300',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'shadow-elevation-1 pointer-events-none inline-block transform rounded-full bg-white ring-0 transition duration-200 ease-in-out',
          isSm ? 'h-4 w-4 translate-y-0.5' : 'h-5 w-5 translate-y-0.5',
          checked ? (isSm ? 'translate-x-4.5' : 'translate-x-5.5') : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export default Switch;
