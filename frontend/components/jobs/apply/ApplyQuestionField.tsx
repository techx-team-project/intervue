'use client';

import { cn } from '@/lib/utils';
import type { ScreeningQuestionResource } from '@/types/recruiter-job';

interface ApplyQuestionFieldProps {
  index: number;
  question: ScreeningQuestionResource;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function ApplyQuestionField({ index, question, value, error, onChange }: ApplyQuestionFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-on-surface text-sm font-semibold">
        {index + 1}. {question.prompt}
        {question.required && <span className="text-error ml-1">*</span>}
      </legend>

      {question.type === 'CHOICE' ? (
        <div role="radiogroup" className="flex flex-wrap gap-2">
          {(question.options ?? []).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={value === option}
              onClick={() => onChange(value === option && !question.required ? '' : option)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                value === option
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-outline text-on-surface-variant hover:bg-surface-container-low bg-white',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          value={value}
          maxLength={1000}
          onChange={(event) => onChange(event.target.value)}
          aria-label={question.prompt}
          className="border-outline focus:border-primary h-11 w-full rounded-xl border px-3.5 text-sm focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
        />
      )}

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </fieldset>
  );
}
