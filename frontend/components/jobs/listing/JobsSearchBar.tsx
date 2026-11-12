'use client';

import { Button } from '@/components/ui/Button';
import ListboxSelect from '@/components/ui/ListboxSelect';
import { CITY_OPTIONS } from '@/constants/home/search';
import type { PublicJobFilters } from '@/types/job-filters';
import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';

const MAX_KEYWORD_LENGTH = 100;

type JobsSearchBarProps = {
  filters: Pick<PublicJobFilters, 'q' | 'city'>;
  onSearch: (patch: Pick<PublicJobFilters, 'q' | 'city'>) => void;
};

export default function JobsSearchBar({ filters, onSearch }: JobsSearchBarProps) {
  const [keyword, setKeyword] = useState(filters.q);
  const [city, setCity] = useState(filters.city);

  return (
    <section aria-label="Search jobs" className="bg-primary-deeper relative overflow-hidden py-5">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <h1 className="sr-only">Find IT jobs</h1>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch({ q: keyword.trim(), city });
          }}
          className="bg-surface shadow-float medium:flex-row medium:items-center medium:rounded-full flex max-w-4xl flex-col gap-2 rounded-2xl p-2"
        >
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 pl-5">
            <Search className="text-on-surface-variant h-5 w-5 shrink-0" aria-hidden />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              maxLength={MAX_KEYWORD_LENGTH}
              placeholder="Job title or company name"
              aria-label="Job title or company name"
              autoComplete="off"
              className="text-body-lg text-on-surface placeholder:text-on-surface-variant caret-primary min-w-0 flex-1 bg-transparent outline-none"
            />
          </label>
          <div className="medium:w-64 medium:border-outline-variant medium:border-l flex h-12 items-center gap-3 px-5">
            <MapPin className="text-on-surface-variant h-5 w-5 shrink-0" aria-hidden />
            <ListboxSelect
              ariaLabel="Location"
              placeholder="All locations"
              searchable
              searchPlaceholder="Search province or city"
              value={city}
              onChange={setCity}
              options={CITY_OPTIONS}
              className="h-full min-w-0 flex-1"
            />
          </div>
          <Button type="submit" size="xl" leftIcon={<Search className="h-4 w-4" aria-hidden />}>
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
