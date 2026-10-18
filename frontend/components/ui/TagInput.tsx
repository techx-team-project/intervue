'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { KeyboardEvent, useId, useState } from 'react';

export interface TagInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({ label, error, helperText, value, onChange, placeholder, maxTags }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const inputId = useId();

  const commitDraft = () => {
    const tag = draft.trim();
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft('');
      return;
    }
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitDraft();
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
      )}

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
            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="cursor-pointer text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-30 flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export default TagInput;
