'use client';

import AdSlot from '@/components/common/AdSlot';
import FeaturedJobCard from '@/components/home/featured-jobs/FeaturedJobCard';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Sheet from '@/components/ui/Sheet';
import Skeleton from '@/components/ui/Skeleton';
import { JOBS_PAGE_SIZE } from '@/constants/job-filters';
import { useJobListView } from '@/hooks/useJobListView';
import { usePublicJobFilters } from '@/hooks/usePublicJobFilters';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { getErrorMessage } from '@/utils/error';
import { describeActiveFilters, parseSkillFilters, toSearchParams } from '@/utils/job-filters';
import { SearchX } from 'lucide-react';
import { useCallback, useState } from 'react';
import ActiveFilterChips from './listing/ActiveFilterChips';
import JobFiltersPanel from './listing/JobFiltersPanel';
import JobListingCard from './listing/JobListingCard';
import JobQuickView from './listing/JobQuickView';
import JobsSearchBar from './listing/JobsSearchBar';
import JobsToolbar from './listing/JobsToolbar';

const SKELETON_COUNT = 5;
const STAGGER_CLASSES = [
  '[animation-delay:0ms]',
  '[animation-delay:50ms]',
  '[animation-delay:100ms]',
  '[animation-delay:150ms]',
  '[animation-delay:200ms]',
  '[animation-delay:250ms]',
];

export default function PublicJobsListView() {
  const { filters, page, update, goToPage, clearAll } = usePublicJobFilters();
  const [view, setView] = useJobListView();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [quickViewJob, setQuickViewJob] = useState<PublicJobSummaryResource | null>(null);
  const closeFilterSheet = useCallback(() => setIsFilterSheetOpen(false), []);
  const closeQuickView = useCallback(() => setQuickViewJob(null), []);
  const query = usePublicJobs(toSearchParams(filters, page, JOBS_PAGE_SIZE));

  const activeFilters = describeActiveFilters(filters);
  const sidebarFilterCount = activeFilters.filter((filter) => filter.id !== 'q' && filter.id !== 'city').length;
  const jobs = query.data?.items ?? [];
  const total = query.data?.totalItems;
  const isGrid = view === 'grid';
  const matchedSkillIds = new Set(parseSkillFilters(filters.skills).map((skill) => skill.id));
  const panel = <JobFiltersPanel filters={filters} onChange={update} />;

  return (
    <>
      <JobsSearchBar key={`${filters.q}|${filters.city}`} filters={filters} onSearch={update} />

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside aria-label="Job filters" className="hidden lg:block">
          <div className="bg-surface border-outline-variant sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border p-5">
            <div className="border-outline-variant mb-5 flex items-center justify-between border-b pb-4">
              <h2 className="font-display text-title-md text-on-surface font-bold">Filters</h2>
              {sidebarFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-label-lg text-primary cursor-pointer font-semibold hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-labelledby="jobs-results-title" className="min-w-0 space-y-4">
          <JobsToolbar
            filters={filters}
            total={total}
            view={view}
            filterCount={sidebarFilterCount}
            onSortChange={(sort) => update({ sort })}
            onViewChange={setView}
            onOpenFilters={() => setIsFilterSheetOpen(true)}
          />

          <ActiveFilterChips filters={activeFilters} onRemove={update} onClear={clearAll} />

          {query.isLoading ? (
            <ul className={cn('gap-4', isGrid ? 'grid sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4')} aria-busy>
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <li key={index}>
                  <Skeleton className={cn('w-full rounded-2xl', isGrid ? 'h-80' : 'h-48')} />
                </li>
              ))}
            </ul>
          ) : query.isError ? (
            <div className="border-error/30 bg-error/10 flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center">
              <p className="text-error text-sm font-semibold">{getErrorMessage(query.error)}</p>
              <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                Try again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-surface border-outline-variant flex flex-col items-center gap-3 rounded-2xl border px-6 py-16 text-center">
              <SearchX className="text-outline h-9 w-9" aria-hidden />
              <p className="text-title-md text-on-surface font-semibold">No jobs match these filters</p>
              <p className="text-body-md text-on-surface-variant max-w-sm">
                Try a different keyword, remove a few filters or choose another location.
              </p>
              {activeFilters.length > 0 && (
                <Button variant="outline" size="md" onClick={clearAll}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <AdSlot code="JOBS_TOP" />
              <ul className={cn('gap-4', isGrid ? 'grid items-stretch sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4')}>
                {jobs.map((job, index) => (
                  <li key={job.id} className={`animate-fade-in-up ${STAGGER_CLASSES[index % STAGGER_CLASSES.length]}`}>
                    {isGrid ? (
                      <FeaturedJobCard job={job} onQuickView={setQuickViewJob} />
                    ) : (
                      <JobListingCard job={job} matchedSkillIds={matchedSkillIds} onQuickView={setQuickViewJob} />
                    )}
                  </li>
                ))}
              </ul>
              <div className="bg-surface border-outline-variant rounded-2xl border p-3.5">
                <Pagination
                  page={page}
                  pageCount={Math.max(1, query.data?.totalPages ?? 1)}
                  totalItems={total ?? 0}
                  pageSize={JOBS_PAGE_SIZE}
                  onPageChange={(next) => {
                    goToPage(next);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </>
          )}
        </section>
      </div>

      <Sheet
        isOpen={isFilterSheetOpen}
        onClose={closeFilterSheet}
        title="Filters"
        ariaLabel="Job filters"
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={clearAll}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={closeFilterSheet}>
              {total === undefined ? 'Show jobs' : `Show ${total.toLocaleString('en-US')} jobs`}
            </Button>
          </>
        }
      >
        {panel}
      </Sheet>

      <JobQuickView job={quickViewJob} matchedSkillIds={matchedSkillIds} onClose={closeQuickView} />
    </>
  );
}
