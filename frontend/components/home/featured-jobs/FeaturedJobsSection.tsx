'use client';

import EmptyState from '@/components/common/EmptyState';
import PublicJobCard from '@/components/jobs/PublicJobCard';
import Skeleton from '@/components/ui/Skeleton';
import { FEATURED_CITY_FILTERS, SEARCH_CITIES } from '@/constants/home/search';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, ListFilter, SearchX, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FEATURED_COUNT = 9;
const STAGGER_CLASSES = [
  '[animation-delay:0ms]',
  '[animation-delay:40ms]',
  '[animation-delay:80ms]',
  '[animation-delay:120ms]',
  '[animation-delay:160ms]',
  '[animation-delay:200ms]',
  '[animation-delay:240ms]',
  '[animation-delay:280ms]',
  '[animation-delay:320ms]',
];
const PAGER_BUTTON_CLASS =
  'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary text-primary transition-colors duration-150 hover:bg-primary-light disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline disabled:hover:bg-transparent';

export default function FeaturedJobsSection() {
  const [city, setCity] = useState('');
  const [page, setPage] = useState(0);
  const query = usePublicJobs({ city, page, size: FEATURED_COUNT });
  const totalPages = query.data?.totalPages ?? 0;

  const changeCity = (next: string) => {
    setCity(next);
    setPage(0);
  };
  const jobs = query.data?.items ?? [];
  const total = query.data?.totalItems;
  const viewAllHref = city ? `/jobs?city=${encodeURIComponent(city)}` : '/jobs';

  return (
    <section id="feature-jobs" aria-labelledby="featured-jobs-title" className="container-page py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-label-lg text-primary font-bold tracking-widest uppercase">Latest opportunities</p>
          <h2 id="featured-jobs-title" className="font-display text-display-md text-on-surface">
            Featured IT jobs
          </h2>
          {total !== undefined && (
            <p className="text-title-md text-on-surface-variant font-normal">
              {total.toLocaleString('en-US')} positions waiting for candidates
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href={viewAllHref} className="text-title-md text-primary font-semibold hover:underline">
            View all
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
              className={PAGER_BUTTON_CLASS}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={PAGER_BUTTON_CLASS}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="bg-surface border-outline-variant relative flex h-12 w-full items-center gap-2 rounded-lg border px-4 sm:w-86">
          <ListFilter className="text-on-surface-variant h-4 w-4 shrink-0" aria-hidden />
          <span className="text-body-lg text-on-surface-variant shrink-0">Filter by:</span>
          <select
            aria-label="Filter by location"
            value={city}
            onChange={(event) => changeCity(event.target.value)}
            className="text-body-lg text-on-surface h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-6 outline-none"
          >
            <option value="">Location</option>
            {SEARCH_CITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="text-on-surface pointer-events-none absolute right-4 h-4 w-4" aria-hidden />
        </div>

        <div role="group" aria-label="Quick filter by location" className="flex flex-wrap gap-2">
          {FEATURED_CITY_FILTERS.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={city === item.id}
              onClick={() => changeCity(item.id)}
              className={cn(
                'text-title-md ease-standard h-12 cursor-pointer rounded-full px-5 transition-colors duration-150',
                city === item.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface hover:bg-primary-tag',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" aria-busy={query.isFetching}>
        {query.isLoading ? (
          <div className="expanded:grid-cols-3 medium:grid-cols-2 grid grid-cols-1 gap-4.5">
            {Array.from({ length: FEATURED_COUNT }, (_, index) => (
              <Skeleton key={index} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        ) : query.isError ? (
          <EmptyState
            tone="error"
            icon={WifiOff}
            title="Could not load jobs"
            description="Please check your connection and try again."
            actionLabel="Try again"
            onAction={() => query.refetch()}
            className="bg-surface"
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching jobs yet"
            description="Try another location or view all jobs."
            actionLabel="All locations"
            onAction={() => changeCity('')}
            className="bg-surface"
          />
        ) : (
          <ul key={`${city}-${page}`} className="expanded:grid-cols-3 medium:grid-cols-2 grid grid-cols-1 gap-4.5">
            {jobs.map((job, index) => (
              <li key={job.id} className={`animate-fade-in-up ${STAGGER_CLASSES[index % STAGGER_CLASSES.length]}`}>
                <PublicJobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
