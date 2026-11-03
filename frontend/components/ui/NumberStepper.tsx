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
  'flex w-11 shrink-0 cursor-pointer items-center justify-center text-slate-600 transition hover:bg-slate-50 focus-visible:bg-slate-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40';

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
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-11 items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:ring-2',
          error
            ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/15'
            : 'border-slate-300 focus-within:border-emerald-600 focus-within:ring-emerald-600/15',
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
          className="w-full min-w-0 [appearance:textfield] border-x border-slate-300 text-center text-sm font-semibold text-slate-800 outline-none disabled:bg-slate-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
        <p id={errorId} className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default NumberStepper;
