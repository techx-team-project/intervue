'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';

type CandidateChipSelectProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  max: number;
  error?: string;
};

export default function CandidateChipSelect({ label, options, value, onChange, max, error }: CandidateChipSelectProps) {
  const labelId = useId();
  const errorId = useId();
  const choices = [...options, ...value.filter((item) => !options.includes(item))];

  const toggle = (item: string) => {
    if (value.includes(item)) onChange(value.filter((selected) => selected !== item));
    else if (value.length < max) onChange([...value, item]);
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span id={labelId} className="block text-sm font-semibold text-slate-800">
          {label}
        </span>
        <span className="text-xs text-slate-500">
          {value.length}/{max} selected
        </span>
      </div>

      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-wrap gap-2"
      >
        {choices.map((item) => {
          const selected = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              disabled={!selected && value.length >= max}
              onClick={() => toggle(item)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                selected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400',
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
