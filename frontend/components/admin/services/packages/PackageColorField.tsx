'use client';

import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { useId } from 'react';

interface PackageColorFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const COLOR_PRESETS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#7c3aed', '#0f172a'] as const;
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

function normalizePickerHex(raw: string): string {
  const trimmed = raw.trim();
  if (!HEX_COLOR_PATTERN.test(trimmed)) return '#16a34a';
  if (trimmed.length === 4) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }
  return trimmed;
}

export default function PackageColorField({
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder = '#16a34a',
}: PackageColorFieldProps) {
  const inputId = useId();
  const pickerHex = normalizePickerHex(value);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-on-surface dark:text-forest-100 block text-sm font-semibold">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <label
          title="Pick accent color"
          className="dark:border-forest-700 dark:bg-forest-950 border-outline-variant relative flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border bg-white p-1.5 transition hover:border-emerald-400"
        >
          <span className="h-full w-full rounded-md border border-black/10" style={{ backgroundColor: pickerHex }} />
          <input
            type="color"
            aria-label={`${label ?? 'Accent color'} swatch picker`}
            value={pickerHex}
            onChange={(event) => onChange(event.target.value)}
            className="sr-only"
          />
        </label>

        <div className="min-w-0 flex-1">
          <Input
            id={inputId}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            className={cn('font-mono', error ? 'border-error focus:border-error' : undefined, CONTROL_DARK_CLASS)}
          />
        </div>

        {value.trim() && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Reset to default color"
            aria-label="Reset color"
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-850 inline-flex h-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border px-3 text-xs transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="dark:text-forest-400 text-on-surface-variant text-[11px]">Presets:</span>
        {COLOR_PRESETS.map((hex) => {
          const isSelected = value.trim().toLowerCase() === hex;
          return (
            <button
              key={hex}
              type="button"
              onClick={() => onChange(hex)}
              title={hex}
              aria-label={`Select color ${hex}`}
              className={cn(
                'h-4.5 w-4.5 cursor-pointer rounded-full border transition hover:scale-110',
                isSelected ? 'ring-primary dark:ring-offset-forest-900 ring-2 ring-offset-1' : 'border-black/15',
              )}
              style={{ backgroundColor: hex }}
            />
          );
        })}
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
      {!error && helperText && <p className="dark:text-forest-400 text-on-surface-variant text-xs">{helperText}</p>}
    </div>
  );
}
