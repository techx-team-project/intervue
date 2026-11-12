import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="text-on-surface block text-sm font-semibold">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'text-on-surface min-h-11 w-full cursor-pointer appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm transition-colors',
              'hover:border-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-emerald-600/15 focus:outline-none',
              'disabled:bg-surface-container-low disabled:text-on-surface-variant dark:disabled:bg-forest-900/60 dark:disabled:text-forest-400 disabled:cursor-not-allowed disabled:opacity-75',
              error ? 'border-error focus:border-error focus:ring-rose-500/15' : 'border-outline',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="text-outline pointer-events-none absolute right-3.5 h-4 w-4" />
        </div>

        {error && <p className="text-error text-xs font-medium">{error}</p>}
        {!error && helperText && <p className="text-on-surface-variant text-xs">{helperText}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
