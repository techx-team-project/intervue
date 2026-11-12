'use client';

import { useDismissable } from '@/hooks/useDismissable';
import { cn } from '@/lib/utils';
import { foldDiacritics } from '@/utils/text';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';

export type ListboxOption = { value: string; label: string };

type ListboxSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  placeholder: string;
  ariaLabel: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  className?: string;
  triggerClassName?: string;
};

export default function ListboxSelect({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  searchable = false,
  searchPlaceholder = 'Search',
  emptyLabel = 'No results found',
  className,
  triggerClassName,
}: ListboxSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');

  const needle = foldDiacritics(query.trim());
  const visibleOptions = needle ? options.filter((option) => foldDiacritics(option.label).includes(needle)) : options;
  const selected = value ? options.find((option) => option.value === value) : undefined;
  const activeDescendant = isOpen && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined;

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery('');
  }, []);
  useDismissable(containerRef, isOpen, close);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      document.getElementById(`${listboxId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex, listboxId]);

  useEffect(() => {
    if (isOpen && searchable) searchRef.current?.focus();
  }, [isOpen, searchable]);

  const open = () => {
    setQuery('');
    setIsOpen(true);
    setActiveIndex(
      Math.max(
        options.findIndex((option) => option.value === value),
        0,
      ),
    );
  };

  const choose = (option: ListboxOption) => {
    onChange(option.value);
    close();
    triggerRef.current?.focus();
  };

  const jumpTo = (typed: string) => {
    const letter = foldDiacritics(typed);
    const startsWithLetter = (option: ListboxOption) => foldDiacritics(option.label).startsWith(letter);
    const from = isOpen ? activeIndex : options.findIndex((option) => option.value === value);
    const next = options.findIndex((option, index) => index > from && startsWithLetter(option));
    const match = next >= 0 ? next : options.findIndex(startsWithLetter);
    if (match < 0) return;
    setIsOpen(true);
    setActiveIndex(match);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const isSearchField = event.currentTarget === searchRef.current;
    const count = visibleOptions.length;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) return open();
      if (count === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((previous) => (previous + step + count) % count);
    } else if (isOpen && !isSearchField && event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (isOpen && !isSearchField && event.key === 'End') {
      event.preventDefault();
      setActiveIndex(count - 1);
    } else if (
      isOpen &&
      (event.key === 'Enter' || (event.key === ' ' && !isSearchField)) &&
      visibleOptions[activeIndex]
    ) {
      event.preventDefault();
      choose(visibleOptions[activeIndex]);
    } else if (!searchable && event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey) {
      jumpTo(event.key);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget)) close();
  };

  return (
    <div ref={containerRef} onBlur={handleBlur} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        className={cn(
          'text-body-lg flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left outline-none',
          selected ? 'text-on-surface' : 'text-on-surface-variant',
          triggerClassName,
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn('ease-standard h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'animate-fade-in-up bg-surface border-outline-variant shadow-elevation-2 absolute top-full left-0 z-30 mt-3 min-w-52 overflow-hidden rounded-2xl border',
            searchable && 'w-72',
          )}
        >
          {searchable && (
            <div className="border-outline-variant relative border-b p-2">
              <Search
                className="text-on-surface-variant pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-label={searchPlaceholder}
                aria-expanded
                aria-controls={listboxId}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="text-body-md text-on-surface placeholder:text-on-surface-variant bg-surface-container-low focus:ring-primary/30 h-10 w-full rounded-xl pr-3 pl-9 outline-none focus:ring-2"
              />
            </div>
          )}

          <ul
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            className={cn('overflow-y-auto py-2', searchable ? 'max-h-64' : 'max-h-72')}
          >
            {visibleOptions.length === 0 && (
              <li role="presentation" className="text-body-md text-on-surface-variant px-4 py-3">
                {emptyLabel}
              </li>
            )}
            {visibleOptions.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  className={cn(
                    'text-body-lg flex h-11 cursor-pointer items-center justify-between gap-3 px-4',
                    isSelected ? 'text-primary font-semibold' : 'text-on-surface',
                    index === activeIndex && 'bg-primary-light',
                  )}
                >
                  {option.label}
                  {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
