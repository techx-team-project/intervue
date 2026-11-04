'use client';

import { cn } from '@/lib/utils';
import { useId, useState, type KeyboardEvent, type Ref } from 'react';

type CandidateSuggestInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  suggestions: string[];
  placeholder?: string;
  error?: string;
  maxLength?: number;
  inputRef?: Ref<HTMLInputElement>;
};

const MAX_SUGGESTIONS = 8;

export default function CandidateSuggestInput({
  label,
  value,
  onChange,
  onBlur,
  suggestions,
  placeholder,
  error,
  maxLength,
  inputRef,
}: CandidateSuggestInputProps) {
  const inputId = useId();
  const listId = useId();
  const errorId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const query = value.trim().toLowerCase();
  const matches = suggestions.filter((item) => item.toLowerCase().includes(query)).slice(0, MAX_SUGGESTIONS);
  const isOpen = isFocused && !dismissed && matches.length > 0;
  const optionId = (index: number) => `${listId}-${index}`;

  const pick = (item: string) => {
    onChange(item);
    setDismissed(true);
    setActiveIndex(-1);
  };

  const handleChange = (next: string) => {
    onChange(next);
    setDismissed(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (matches.length === 0) return;
      event.preventDefault();
      setDismissed(false);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + step + matches.length) % matches.length);
    } else if (event.key === 'Enter' && isOpen && activeIndex >= 0 && !event.nativeEvent.isComposing) {
      event.preventDefault();
      pick(matches[activeIndex]);
    } else if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setDismissed(true);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative w-full space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setActiveIndex(-1);
          onBlur?.();
        }}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors',
          'focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none',
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : 'border-slate-300',
        )}
      />

      <ul
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        hidden={!isOpen}
        className="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
      >
        {matches.map((item, index) => (
          <li
            key={item}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => pick(item)}
            onMouseEnter={() => setActiveIndex(index)}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors',
              index === activeIndex ? 'bg-emerald-50 font-semibold text-emerald-700' : 'hover:bg-emerald-50',
            )}
          >
            {item}
          </li>
        ))}
      </ul>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
