'use client';

import { Button } from '@/components/ui/Button';
import ListboxSelect from '@/components/ui/ListboxSelect';
import { CITY_OPTIONS, POPULAR_KEYWORDS } from '@/constants/home/search';
import { useDismissable } from '@/hooks/useDismissable';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { MapPin, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, useTransition } from 'react';

const MAX_SUGGESTIONS = 6;
const MAX_KEYWORD_LENGTH = 100;

export default function SearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const recent = useRecentSearches();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const needle = keyword.trim().toLowerCase();
  const suggestions = (needle ? POPULAR_KEYWORDS.filter((item) => item.toLowerCase().includes(needle)) : recent.items)
    .filter((item) => item.toLowerCase() !== needle)
    .slice(0, MAX_SUGGESTIONS);
  const showList = isOpen && suggestions.length > 0;

  const closeList = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };
  useDismissable(containerRef, isOpen, closeList);

  const search = (term: string) => {
    const params = new URLSearchParams();
    if (term.trim()) params.set('q', term.trim());
    if (city) params.set('city', city);
    recent.add(term);
    closeList();
    const query = params.toString();
    startTransition(() => router.push(query ? `/jobs?${query}` : '/jobs'));
  };

  const pick = (term: string) => {
    setKeyword(term);
    search(term);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === 'Enter' && showList && activeIndex >= 0) {
      event.preventDefault();
      pick(suggestions[activeIndex]);
    }
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        search(keyword);
      }}
      className="bg-surface shadow-float ease-standard focus-within:ring-primary-bright/40 medium:h-19 medium:flex-row medium:items-center medium:rounded-full flex flex-col gap-2 rounded-2xl p-2 transition-shadow duration-200 focus-within:ring-4"
    >
      <div ref={containerRef} className="relative min-w-0 flex-1">
        <div className="flex h-14 items-center gap-2 pr-2 pl-6">
          <input
            type="text"
            role="combobox"
            aria-label="Job title or company name"
            aria-expanded={showList}
            aria-controls={listboxId}
            aria-activedescendant={showList && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            maxLength={MAX_KEYWORD_LENGTH}
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Job title or company name"
            className="text-body-lg text-on-surface placeholder:text-on-surface-variant caret-primary min-w-0 flex-1 bg-transparent outline-none"
          />
          {keyword && (
            <button
              type="button"
              aria-label="Clear keyword"
              onClick={() => setKeyword('')}
              className="state-layer text-on-surface-variant flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        {showList && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={needle ? 'Keyword suggestions' : 'Recent searches'}
            className="animate-fade-in-up bg-surface border-outline-variant shadow-elevation-2 absolute top-full right-0 left-0 z-20 mt-3 overflow-hidden rounded-2xl border py-2"
          >
            {suggestions.map((item, index) => (
              <li
                key={item}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(item)}
                className={`text-body-lg text-on-surface hover:bg-primary-light flex h-11 cursor-pointer items-center px-5 ${
                  index === activeIndex ? 'bg-primary-light' : ''
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="medium:w-64 medium:border-outline-variant medium:border-l flex h-14 items-center gap-3 px-5">
        <MapPin className="text-on-surface-variant h-5 w-5 shrink-0" aria-hidden />
        <ListboxSelect
          ariaLabel="Location"
          placeholder="Location"
          searchable
          searchPlaceholder="Search province or city"
          value={city}
          onChange={setCity}
          options={CITY_OPTIONS}
          className="h-full min-w-0 flex-1"
        />
      </div>

      <Button type="submit" size="2xl" isLoading={isPending} leftIcon={<Search className="h-5 w-5" aria-hidden />}>
        Search
      </Button>
    </form>
  );
}
