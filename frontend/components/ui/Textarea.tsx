import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 5, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-on-surface block text-sm font-semibold">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'text-on-surface w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm placeholder-slate-400 transition-colors',
            'focus:border-primary focus:ring-2 focus:ring-emerald-600/15 focus:outline-none',
            error ? 'border-error focus:border-error focus:ring-rose-500/15' : 'border-outline',
            className,
          )}
          {...props}
        />

        {error && <p className="text-error text-xs font-medium">{error}</p>}
        {!error && helperText && <p className="text-on-surface-variant text-xs">{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
