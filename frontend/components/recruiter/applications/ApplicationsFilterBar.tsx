'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  AI_MATCH_BAND_OPTIONS,
  APPLICATION_SORT_OPTIONS,
  APPLICATION_SOURCE_LABEL,
} from '@/constants/application-status';
import { cn } from '@/lib/utils';
import { MOCK_RECRUITER_JOB_POSTS } from '@/mocks/job.mock';
import type { ApplicationFilters, ApplicationSource, ApplicationSortKey } from '@/types/recruiter-application';
import { Bookmark, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ApplicationsFilterBarProps {
  filters: ApplicationFilters;
  resultCount: number;
  onFilterChange: <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => void;
  onReset: () => void;
}

const DEBOUNCE_MS = 300;

const JOB_OPTIONS = [
  { value: '', label: 'All job posts' },
  ...MOCK_RECRUITER_JOB_POSTS.map((job) => ({ value: job.id, label: job.title })),
];

const SOURCE_OPTIONS = [
  { value: '', label: 'Any source' },
  ...(Object.keys(APPLICATION_SOURCE_LABEL) as ApplicationSource[]).map((source) => ({
    value: source,
    label: APPLICATION_SOURCE_LABEL[source],
  })),
];

export default function ApplicationsFilterBar({
  filters,
  resultCount,
  onFilterChange,
  onReset,
}: ApplicationsFilterBarProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => onFilterChange('search', searchDraft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const hasActiveFilter =
    filters.search !== '' ||
    filters.jobId !== '' ||
    filters.aiMatchBand !== 'ALL' ||
    filters.source !== '' ||
    filters.savedOnly ||
    filters.sort !== 'NEWEST';

  return (
    <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5 shadow-xs">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="min-w-0 xl:w-80">
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by name, title, email or skill..."
            aria-label="Search applications"
            leftIcon={<Search className="h-4 w-4" />}
            rightElement={
              searchDraft.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSearchDraft('')}
                  aria-label="Clear the search keyword"
                  className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-2.5">
          <Select
            value={filters.jobId}
            onChange={(event) => onFilterChange('jobId', event.target.value)}
            options={JOB_OPTIONS}
            aria-label="Filter by job post"
          />

          <Select
            value={filters.aiMatchBand}
            onChange={(event) => onFilterChange('aiMatchBand', event.target.value as ApplicationFilters['aiMatchBand'])}
            options={AI_MATCH_BAND_OPTIONS}
            aria-label="Filter by AI match score"
          />

          <Select
            value={filters.source}
            onChange={(event) => onFilterChange('source', event.target.value as ApplicationSource | '')}
            options={SOURCE_OPTIONS}
            aria-label="Filter by application source"
          />

          <Select
            value={filters.sort}
            onChange={(event) => onFilterChange('sort', event.target.value as ApplicationSortKey)}
            options={APPLICATION_SORT_OPTIONS}
            aria-label="Sort applications"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1f5f9] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterChange('savedOnly', !filters.savedOnly)}
            aria-pressed={filters.savedOnly}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors',
              filters.savedOnly
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <Bookmark className={cn('h-3.5 w-3.5', filters.savedOnly && 'fill-current')} />
            Saved candidates only
          </button>

          {filters.search.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[12px] font-bold text-sky-700">
              <Search className="h-3.5 w-3.5" />
              Keyword: {filters.search}
            </span>
          )}

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setSearchDraft('');
                onReset();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-bold text-[#64748b] transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        <p className="text-[12px] font-semibold text-[#64748b]">
          Showing <span className="text-navy font-black">{resultCount}</span> applications
        </p>
      </div>
    </div>
  );
}
