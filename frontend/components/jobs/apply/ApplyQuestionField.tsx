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
      <legend className="text-sm font-semibold text-slate-800">
        {index + 1}. {question.prompt}
        {question.required && <span className="ml-1 text-rose-500">*</span>}
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
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
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
          className="h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
        />
      )}

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </fieldset>
  );
}
