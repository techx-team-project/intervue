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
        <label htmlFor={inputId} className="text-on-surface block text-sm font-semibold">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white px-3 py-2 transition-colors',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-emerald-600/15',
          error ? 'border-error' : 'border-outline',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="border-primary/30 bg-primary-light text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-primary hover:text-on-primary-container cursor-pointer"
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
          className="text-on-surface min-w-30 flex-1 border-none bg-transparent py-1 text-sm placeholder-slate-400 focus:outline-none"
        />
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
      {!error && helperText && <p className="text-on-surface-variant text-xs">{helperText}</p>}
    </div>
  );
}

export default TagInput;
