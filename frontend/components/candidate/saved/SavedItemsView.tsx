'use client';

import { candidateApplicationApi } from '@/apiRequest/candidate-application';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import PublicJobCard from '@/components/jobs/PublicJobCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useFollowedCompanies, useSavedJobs } from '@/hooks/useCandidateSaved';
import { cn } from '@/lib/utils';
import type { CandidateApplicationStatus } from '@/types/candidate-application';
import { formatRelativeDay } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { useQuery } from '@tanstack/react-query';
import { Building2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import FollowedCompanyCard from './FollowedCompanyCard';
import SavedJobUnavailableCard from './SavedJobUnavailableCard';

const PAGE_SIZE = 12;

type Tab = 'jobs' | 'companies' | 'applied';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'jobs', label: 'Saved jobs' },
  { value: 'companies', label: 'Followed companies' },
  { value: 'applied', label: 'Applied jobs' },
];

const APPLICATION_STATUS_META: Record<
  CandidateApplicationStatus,
  { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'danger' }
> = {
  DRAFT: { label: 'Draft', variant: 'default' },
  APPLIED: { label: 'Applied', variant: 'info' },
  VIEWED: { label: 'Viewed by recruiter', variant: 'info' },
  IN_REVIEW: { label: 'In review', variant: 'warning' },
  INTERVIEW: { label: 'Interview', variant: 'warning' },
  OFFER: { label: 'Offer', variant: 'success' },
  HIRED: { label: 'Hired', variant: 'success' },
  REJECTED: { label: 'Not a fit', variant: 'danger' },
  WITHDRAWN: { label: 'Withdrawn', variant: 'default' },
  JOB_CLOSED: { label: 'Job closed', variant: 'default' },
};

function Feedback({ isLoading, error, onRetry }: { isLoading: boolean; error: unknown; onRetry: () => void }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function Empty({ title, hint, href, cta }: { title: string; hint: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <Link href={href} className="mt-4 inline-block">
        <Button size="sm">{cta}</Button>
      </Link>
    </div>
  );
}

function SavedJobsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useSavedJobs(page - 1, PAGE_SIZE);

  if (isLoading || isError) return <Feedback isLoading={isLoading} error={error} onRetry={() => refetch()} />;
  if (!data || data.items.length === 0) {
    return (
      <Empty
        title="You have not saved any jobs yet"
        hint="Click the heart icon on a job post to save it for later."
        href="/jobs"
        cta="Find jobs"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.items.map((saved) =>
          saved.job ? (
            <PublicJobCard key={saved.jobId} job={saved.job} />
          ) : (
            <SavedJobUnavailableCard key={saved.jobId} jobId={saved.jobId} />
          ),
        )}
      </div>
      <Pagination
        page={page}
        pageCount={data.totalPages}
        totalItems={data.totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

function FollowedCompaniesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useFollowedCompanies(page - 1, PAGE_SIZE);

  if (isLoading || isError) return <Feedback isLoading={isLoading} error={error} onRetry={() => refetch()} />;
  if (!data || data.items.length === 0) {
    return (
      <Empty
        title="You are not following any companies yet"
        hint="Follow companies to get notified as soon as they post new jobs."
        href="/jobs"
        cta="Explore jobs"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.items.map((followed) => (
          <FollowedCompanyCard key={followed.companyId} followed={followed} />
        ))}
      </div>
      <Pagination
        page={page}
        pageCount={data.totalPages}
        totalItems={data.totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

function AppliedJobsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['candidate-applications', page - 1, PAGE_SIZE],
    queryFn: () => candidateApplicationApi.list(page - 1, PAGE_SIZE),
  });

  if (isLoading || isError) return <Feedback isLoading={isLoading} error={error} onRetry={() => refetch()} />;
  if (!data || data.items.length === 0) {
    return (
      <Empty
        title="You have not applied to any jobs yet"
        hint="Explore matching positions and apply online right away."
        href="/jobs"
        cta="Find jobs"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.items.map((app) => {
          const meta = APPLICATION_STATUS_META[app.status] ?? { label: app.status, variant: 'default' as const };
          return (
            <Link
              key={app.id}
              href={`/jobs/${app.jobId}`}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{app.jobTitle}</p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{app.companyName}</span>
                  </p>
                </div>
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                <span className="flex min-w-0 items-center gap-1.5 truncate">
                  {app.cv?.fileName && (
                    <>
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{app.cv.fileName}</span>
                    </>
                  )}
                </span>
                {app.submittedAt && <span className="shrink-0">Applied {formatRelativeDay(app.submittedAt)}</span>}
              </div>
            </Link>
          );
        })}
      </div>
      <Pagination
        page={page}
        pageCount={data.totalPages}
        totalItems={data.totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

export default function SavedItemsView({ initialTab = 'jobs' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="container-page space-y-5 py-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">Saved and following</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review the jobs you like, positions you applied to and companies you follow.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => setTab(item.value)}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              tab === item.value
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'jobs' && <SavedJobsTab />}
      {tab === 'companies' && <FollowedCompaniesTab />}
      {tab === 'applied' && <AppliedJobsTab />}
    </div>
  );
}
