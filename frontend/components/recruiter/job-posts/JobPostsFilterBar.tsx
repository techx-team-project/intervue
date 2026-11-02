'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  JOB_ARRANGEMENT_OPTIONS,
  JOB_LEVEL_OPTIONS,
  JOB_LOCATION_OPTIONS,
  JOB_SORT_OPTIONS,
} from '@/constants/recruiter-job';
import type { RecruiterJobSort } from '@/types/recruiter-job';
import { RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface JobPostsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  arrangement: string;
  onArrangementChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  sort: RecruiterJobSort;
  onSortChange: (value: RecruiterJobSort) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const DEBOUNCE_MS = 300;

export default function JobPostsFilterBar({
  search,
  onSearchChange,
  level,
  onLevelChange,
  arrangement,
  onArrangementChange,
  location,
  onLocationChange,
  sort,
  onSortChange,
  onResetFilters,
  isFiltered,
}: JobPostsFilterBarProps) {
  const [prevSearch, setPrevSearch] = useState(search);
  const [draft, setDraft] = useState(search);

  // Sync draft if search is reset externally without triggering effect setState error
  if (prevSearch !== search) {
    setPrevSearch(search);
    setDraft(search);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft !== search) {
        onSearchChange(draft);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, onSearchChange, search]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4">
      {/* Top row: Search input + Clear button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search by job title, skill (e.g. Java, React), or ID..."
            leftIcon={<Search className="h-4 w-4 text-slate-400" />}
          />
          {draft && (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                onSearchChange('');
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setDraft('');
              onResetFilters();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset filters</span>
          </button>
        )}
      </div>

      {/* Bottom row: Filter & Sort dropdowns */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div>
          <Select value={level} onChange={(e) => onLevelChange(e.target.value)} options={JOB_LEVEL_OPTIONS} />
        </div>

        <div>
          <Select
            value={arrangement}
            onChange={(e) => onArrangementChange(e.target.value)}
            options={JOB_ARRANGEMENT_OPTIONS}
          />
        </div>

        <div>
          <Select value={location} onChange={(e) => onLocationChange(e.target.value)} options={JOB_LOCATION_OPTIONS} />
        </div>

        <div>
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as RecruiterJobSort)}
            options={JOB_SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
