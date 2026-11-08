'use client';

import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { useId, type Ref } from 'react';

type NumberStepperProps = {
  id?: string;
  name?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
};

const STEP_BUTTON_CLASS =
  'flex w-11 shrink-0 cursor-pointer items-center justify-center text-on-surface-variant transition hover:bg-surface-container-low focus-visible:bg-surface-container-high focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40';

export function NumberStepper({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  ref,
  min = 1,
  max = 999,
  disabled,
  error,
  className,
}: NumberStepperProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const errorId = `${inputId}-error`;
  const valueName = label?.replace(/\s*\*$/, '').toLowerCase() ?? 'value';
  const hasValue = Number.isFinite(value);
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const step = (delta: number) => onChange(hasValue ? clamp(value + delta) : min);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-on-surface block text-sm font-semibold">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-11 items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:ring-2',
          error
            ? 'border-error focus-within:border-error focus-within:ring-rose-500/15'
            : 'border-outline focus-within:border-primary focus-within:ring-emerald-600/15',
        )}
      >
        <button
          type="button"
          aria-label={`Decrease ${valueName}`}
          aria-controls={inputId}
          onClick={() => step(-1)}
          disabled={disabled || (hasValue && value <= min)}
          className={STEP_BUTTON_CLASS}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          disabled={disabled}
          value={hasValue ? value : ''}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10);
            onChange(Number.isNaN(parsed) ? Number.NaN : parsed);
          }}
          onBlur={() => {
            if (hasValue && clamp(value) !== value) onChange(clamp(value));
            onBlur?.();
          }}
          className="border-outline text-on-surface disabled:bg-surface-container-low w-full min-w-0 [appearance:textfield] border-x text-center text-sm font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Increase ${valueName}`}
          aria-controls={inputId}
          onClick={() => step(1)}
          disabled={disabled || (hasValue && value >= max)}
          className={STEP_BUTTON_CLASS}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <p id={errorId} className="text-error text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default NumberStepper;
