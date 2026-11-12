'use client';

import { JOB_FORM_BENEFIT_OPTIONS } from '@/constants/recruiter-job';
import { cn } from '@/lib/utils';
import { JOB_MAX_BENEFIT_TAGS } from '@/schemas/job.schema';
import type { JobBenefitTag } from '@/types/recruiter-job';
import { Check } from 'lucide-react';

interface BenefitTagPickerProps {
  value: JobBenefitTag[];
  onChange: (value: JobBenefitTag[]) => void;
}

export default function BenefitTagPicker({ value, onChange }: BenefitTagPickerProps) {
  const toggle = (tag: JobBenefitTag) =>
    onChange(value.includes(tag) ? value.filter((item) => item !== tag) : [...value, tag]);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {JOB_FORM_BENEFIT_OPTIONS.map((option) => {
          const selected = value.includes(option.value);
          const locked = !selected && value.length >= JOB_MAX_BENEFIT_TAGS;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => toggle(option.value)}
              className={cn(
                'text-body-sm inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                selected
                  ? 'border-primary bg-primary-light text-primary-deep'
                  : 'border-outline-variant text-on-surface-variant hover:border-on-surface-variant/60 bg-white',
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="text-body-sm text-on-surface-variant">
        Selected {value.length}/{JOB_MAX_BENEFIT_TAGS}
      </p>
    </div>
  );
}
