'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { JobPostFormData } from '@/schemas/job.schema';
import { AlertCircle, Check, DollarSign } from 'lucide-react';
import { UseFormReturn, useWatch } from 'react-hook-form';

const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
];

const PRESETS = [
  { label: 'Negotiable', negotiable: true },
  { label: '< 15M', min: 10000000, max: 15000000, negotiable: false },
  { label: '15M – 25M', min: 15000000, max: 25000000, negotiable: false },
  { label: '25M – 40M', min: 25000000, max: 40000000, negotiable: false },
  { label: '> 40M', min: 40000000, max: 70000000, negotiable: false },
];

interface JobCompensationSectionProps {
  form: UseFormReturn<JobPostFormData>;
}

export default function JobCompensationSection({ form }: JobCompensationSectionProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const negotiable = useWatch({ control, name: 'salary.negotiable' });
  const minVal = useWatch({ control, name: 'salary.min' });
  const maxVal = useWatch({ control, name: 'salary.max' });
  const currency = useWatch({ control, name: 'salary.currency' }) || 'VND';

  const parsePositiveNumber = (val: unknown): number | undefined => {
    if (typeof val === 'number' && !Number.isNaN(val) && val > 0) return val;
    if (typeof val === 'string' && val.trim() !== '') {
      const parsed = Number(val);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    return undefined;
  };

  const validMin = parsePositiveNumber(minVal);
  const validMax = parsePositiveNumber(maxVal);

  const isMinGreaterThanMax = !negotiable && validMin !== undefined && validMax !== undefined && validMin > validMax;

  const formatVnd = (num?: number) => {
    if (num === undefined || Number.isNaN(num)) return '';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[number]) => {
    if (preset.negotiable) {
      setValue('salary.negotiable', true, { shouldValidate: true, shouldDirty: true });
      setValue('salary.min', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('salary.max', undefined, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('salary.negotiable', false, { shouldValidate: true, shouldDirty: true });
      setValue('salary.min', preset.min, { shouldValidate: true, shouldDirty: true });
      setValue('salary.max', preset.max, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <section
      id="section-compensation"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
            2
          </span>
          <div>
            <h2 className="text-navy text-[16px] font-bold">Compensation & Salary</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Clear compensation ranges attract 30% more qualified applicants.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            {...register('salary.negotiable')}
          />
          <span>Negotiable salary</span>
        </label>
      </div>

      {/* Quick Salary Presets */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="text-[11px] font-semibold text-slate-400">Quick presets:</span>
        {PRESETS.map((p) => {
          const isSelected =
            p.negotiable === negotiable && (p.negotiable || (validMin === p.min && validMax === p.max));

          return (
            <button
              key={p.label}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && <Check className="h-3 w-3 text-emerald-600" />}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Numeric inputs when not negotiable */}
      {!negotiable && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Input
                label="Minimum salary"
                type="number"
                placeholder="e.g. 15000000"
                error={errors.salary?.min?.message}
                {...register('salary.min', {
                  setValueAs: (v) => (v === '' || v === null || Number.isNaN(Number(v)) ? undefined : Number(v)),
                })}
              />
              {validMin !== undefined ? (
                <p className="mt-1 text-[11px] font-medium text-emerald-700">
                  ≈ {formatVnd(validMin)} {currency}
                </p>
              ) : null}
            </div>

            <div>
              <Input
                label="Maximum salary"
                type="number"
                placeholder="e.g. 25000000"
                error={errors.salary?.max?.message}
                {...register('salary.max', {
                  setValueAs: (v) => (v === '' || v === null || Number.isNaN(Number(v)) ? undefined : Number(v)),
                })}
              />
              {validMax !== undefined ? (
                <p className="mt-1 text-[11px] font-medium text-emerald-700">
                  ≈ {formatVnd(validMax)} {currency}
                </p>
              ) : null}
            </div>

            <Select label="Currency" options={CURRENCY_OPTIONS} {...register('salary.currency')} />
          </div>

          {/* Validation warning if min > max */}
          {isMinGreaterThanMax && validMin !== undefined && validMax !== undefined ? (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                Minimum salary ({formatVnd(validMin)}) is greater than maximum salary ({formatVnd(validMax)}
                ). Please check your values.
              </span>
            </div>
          ) : null}

          {/* Formatted live preview bar */}
          {validMin !== undefined && validMax !== undefined && !isMinGreaterThanMax ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-slate-500">Applicant will see:</span>
              <span className="text-navy font-bold">
                {formatVnd(validMin)} – {formatVnd(validMax)} {currency} / month
              </span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
