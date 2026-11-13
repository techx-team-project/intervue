'use client';

import {
  clearRecentlyViewedJobs,
  parseRecentlyViewedJobs,
  readRecentlyViewedRaw,
  subscribeRecentlyViewed,
} from '@/utils/recently-viewed-jobs';
import { History } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';

export default function RecentlyViewedJobsSection() {
  const raw = useSyncExternalStore(subscribeRecentlyViewed, readRecentlyViewedRaw, () => '');
  const jobs = useMemo(() => parseRecentlyViewedJobs(raw), [raw]);

  if (jobs.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-title" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="recently-viewed-title" className="font-display text-title-lg text-on-surface flex items-center gap-2">
          <History className="text-primary h-5 w-5" aria-hidden />
          Recently viewed
        </h2>
        <button
          type="button"
          onClick={clearRecentlyViewedJobs}
          className="text-label-lg text-on-surface-variant hover:text-primary cursor-pointer font-semibold transition-colors"
        >
          Clear
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              href={`/jobs/${job.id}`}
              className="border-outline-variant hover:border-primary block rounded-xl border bg-white p-4 transition-colors"
            >
              <p className="text-on-surface line-clamp-1 font-semibold">{job.title}</p>
              <p className="text-body-sm text-on-surface-variant line-clamp-1">
                {job.companyName}
                {job.city ? ` · ${job.city}` : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
