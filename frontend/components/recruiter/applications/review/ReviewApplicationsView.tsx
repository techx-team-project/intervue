'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { REVIEW_PAGE_SIZE, REVIEW_TABS } from '@/constants/application-review';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRecruiterJobList } from '@/hooks/useRecruiterJobs';
import { useReviewApplicationList, useReviewCounts } from '@/hooks/useRecruiterApplications';
import { cn } from '@/lib/utils';
import type { CandidateApplicationStatus } from '@/types/candidate-application';
import { getErrorMessage } from '@/utils/error';
import { Inbox, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ReviewApplicationRow from './ReviewApplicationRow';

const JOB_OPTIONS_LIMIT = 100;
const SEARCH_DEBOUNCE_MS = 300;

export default function ReviewApplicationsView() {
  const initialJob = Number(useSearchParams().get('job')) || undefined;
  const [jobId, setJobId] = useState<number | undefined>(initialJob);
  const [status, setStatus] = useState<CandidateApplicationStatus | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const jobs = useRecruiterJobList({ page: 0, size: JOB_OPTIONS_LIMIT });
  const counts = useReviewCounts(jobId);
  const list = useReviewApplicationList({
    jobId,
    status,
    q: debouncedSearch,
    page: page - 1,
    size: REVIEW_PAGE_SIZE,
  });

  const items = list.data?.items ?? [];
  const countOf = (value: CandidateApplicationStatus | undefined) =>
    value ? (counts.data?.byStatus[value] ?? 0) : (counts.data?.total ?? 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={jobId ?? ''}
          onChange={(event) => {
            setJobId(event.target.value ? Number(event.target.value) : undefined);
            setPage(1);
          }}
          aria-label="Filter by job"
          className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 focus:border-emerald-600 focus:outline-none sm:w-72"
        >
          <option value="">All jobs</option>
          {(jobs.data?.items ?? [])
            .filter((job) => job.status !== 'DRAFT')
            .map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
        </select>

        <label className="relative block flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by candidate name or email"
            aria-label="Search candidates"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pr-3 pl-9 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
          />
        </label>
      </div>

      <div role="tablist" aria-label="Application status" className="flex flex-wrap gap-1.5">
        {REVIEW_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={status === tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
              status === tab.value
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {tab.label} <span className="ml-0.5 text-slate-400">{countOf(tab.value)}</span>
          </button>
        ))}
      </div>

      {list.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : list.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-700">{getErrorMessage(list.error)}</p>
          <Button variant="outline" size="sm" onClick={() => list.refetch()}>
            Try again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Inbox className="h-9 w-9 text-slate-300" aria-hidden />
          <p className="text-sm font-semibold text-slate-700">No applications yet</p>
          <p className="text-xs text-slate-500">Applications submitted to your company&apos;s jobs will appear here.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            {items.map((application) => (
              <ReviewApplicationRow key={application.id} application={application} />
            ))}
          </ul>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <Pagination
              page={page}
              pageCount={Math.max(1, list.data?.totalPages ?? 1)}
              totalItems={list.data?.totalItems ?? 0}
              pageSize={REVIEW_PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
