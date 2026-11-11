import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  radius?: 'md' | 'lg' | 'xl' | 'full';
  focusTone?: 'primary' | 'neutral';
}

const radiusStyles: Record<NonNullable<InputProps['radius']>, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const focusToneStyles: Record<NonNullable<InputProps['focusTone']>, string> = {
  primary: 'border-outline focus:border-primary focus:ring-2 focus:ring-emerald-600/15 focus:outline-none',
  neutral:
    'border-slate-200 hover:border-slate-300 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200/60 focus:outline-none',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightElement, radius = 'xl', focusTone = 'primary', id, ...props },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-on-surface block text-sm font-semibold">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="text-outline pointer-events-none absolute left-3.5 flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'text-on-surface w-full border bg-white px-3.5 py-2.5 text-sm placeholder-slate-400 transition-colors',
              radiusStyles[radius],
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightElement ? 'pr-11' : 'pr-3.5',
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-rose-500/15 focus:outline-none'
                : focusToneStyles[focusTone],
              className,
            )}
            {...props}
          />

          {rightElement && (
            <div className="text-outline absolute right-3 flex items-center justify-center">{rightElement}</div>
          )}
        </div>

        {error && <p className="text-error text-xs font-medium">{error}</p>}
        {!error && helperText && <p className="text-on-surface-variant text-xs">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
