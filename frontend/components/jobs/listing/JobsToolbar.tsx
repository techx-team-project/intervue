'use client';

import { buttonClassName } from '@/components/ui/Button';
import ListboxSelect from '@/components/ui/ListboxSelect';
import { SORT_OPTIONS } from '@/constants/job-filters';
import type { JobListView } from '@/hooks/useJobListView';
import { cn } from '@/lib/utils';
import type { PublicJobFilters } from '@/types/job-filters';
import { LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react';

type JobsToolbarProps = {
  filters: PublicJobFilters;
  total?: number;
  view: JobListView;
  filterCount: number;
  onSortChange: (sort: string) => void;
  onViewChange: (view: JobListView) => void;
  onOpenFilters: () => void;
};

const VIEW_BUTTON_CLASS = 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors';

export default function JobsToolbar({
  filters,
  total,
  view,
  filterCount,
  onSortChange,
  onViewChange,
  onOpenFilters,
}: JobsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="jobs-results-title" className="font-display text-title-lg text-on-surface font-bold">
        {total === undefined ? 'Jobs' : `${total.toLocaleString('en-US')} ${total === 1 ? 'job' : 'jobs'} found`}
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className={buttonClassName({ variant: 'outline', size: 'md', className: 'px-4 lg:hidden' })}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters{filterCount > 0 ? ` (${filterCount})` : ''}
        </button>

        <div className="border-outline-variant bg-surface flex h-10 items-center gap-2 rounded-full border pl-4">
          <span className="text-label-lg text-on-surface-variant hidden sm:inline">Sort</span>
          <ListboxSelect
            ariaLabel="Sort jobs"
            placeholder="Recommended"
            value={filters.sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            popupAlign="right"
            className="h-full"
            triggerClassName="text-label-lg pr-3 font-semibold text-on-surface"
          />
        </div>

        <div
          role="group"
          aria-label="Layout"
          className="border-outline-variant bg-surface flex h-10 items-center gap-1 rounded-full border px-1"
        >
          {(
            [
              { value: 'list', label: 'List view', icon: LayoutList },
              { value: 'grid', label: 'Grid view', icon: LayoutGrid },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
              className={cn(
                VIEW_BUTTON_CLASS,
                view === value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
