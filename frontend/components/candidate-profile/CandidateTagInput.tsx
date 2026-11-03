'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useId, useState, type KeyboardEvent, type Ref } from 'react';

type CandidateTagInputProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  max: number;
  placeholder?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

const MAX_SUGGESTIONS = 8;
const MAX_TAG_LENGTH = 60;

export default function CandidateTagInput({
  label,
  value,
  onChange,
  suggestions,
  max,
  placeholder,
  error,
  inputRef,
}: CandidateTagInputProps) {
  const inputId = useId();
  const groupLabelId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState('');
  const isFull = value.length >= max;
  const taken = new Set(value.map((tag) => tag.toLowerCase()));
  const query = draft.trim().toLowerCase();
  const matches = suggestions
    .filter((item) => !taken.has(item.toLowerCase()) && item.toLowerCase().includes(query))
    .slice(0, MAX_SUGGESTIONS);

  const add = (tag: string) => {
    const next = tag.trim();
    setDraft('');
    if (next === '' || isFull || taken.has(next.toLowerCase())) return;
    onChange([...value, next]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === ',') && !event.nativeEvent.isComposing) {
      event.preventDefault();
      add(draft);
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div role="group" aria-labelledby={groupLabelId} className="w-full space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label id={groupLabelId} htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
        <span className="text-xs text-slate-500">
          {value.length}/{max}
        </span>
      </div>

      <div
        className={cn(
          'flex w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white px-3 py-2 transition-colors',
          'focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15',
          error ? 'border-rose-400' : 'border-slate-300',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((item) => item !== tag))}
              aria-label={`Remove ${tag}`}
              className="cursor-pointer text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          aria-invalid={Boolean(error)}
          type="text"
          value={draft}
          maxLength={MAX_TAG_LENGTH}
          disabled={isFull}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(draft)}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-30 flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {!isFull && matches.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {matches.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => add(item)}
              className="cursor-pointer rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-400"
            >
              + {item}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
