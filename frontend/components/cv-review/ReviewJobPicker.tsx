'use client';

import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { foldDiacritics } from '@/utils/text';
import { Check, Search } from 'lucide-react';
import { useState } from 'react';

type ReviewJobPickerProps = {
  jobs: PublicJobSummaryResource[];
  selectedJobId: number | null;
  onSelect: (jobId: number) => void;
};

export default function ReviewJobPicker({ jobs, selectedJobId, onSelect }: ReviewJobPickerProps) {
  const [query, setQuery] = useState('');
  const needle = foldDiacritics(query.trim());
  const visibleJobs = jobs.filter(
    (job) =>
      !needle ||
      foldDiacritics(job.title).includes(needle) ||
      foldDiacritics(job.company.name).includes(needle) ||
      foldDiacritics(job.city ?? '').includes(needle),
  );

  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search
          className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, company or location"
          aria-label="Search jobs"
          className="text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary h-11 w-full rounded-xl border bg-white pr-3 pl-10 transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      </label>

      <ul className="scrollbar-on-hover border-outline-variant max-h-64 divide-y divide-[var(--color-outline-variant)] overflow-y-auto rounded-xl border">
        {visibleJobs.length === 0 && (
          <li className="text-body-md text-on-surface-variant px-4 py-6 text-center">No matching jobs found.</li>
        )}
        {visibleJobs.map((job) => {
          const isSelected = selectedJobId === job.id;
          return (
            <li key={job.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(job.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  isSelected ? 'bg-primary-light' : 'hover:bg-surface-container-low',
                )}
              >
                <span className="min-w-0">
                  <span className="text-body-md text-on-surface block truncate font-semibold">{job.title}</span>
                  <span className="text-label-md text-on-surface-variant block truncate">
                    {job.company.name} · {job.city ?? 'Nationwide'}
                  </span>
                </span>
                {isSelected && <Check className="text-primary h-4 w-4 shrink-0" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
