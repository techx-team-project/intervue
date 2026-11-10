'use client';

import { candidateApplicationApi } from '@/apiRequest/candidate-application';
import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import type { CandidateApplication } from '@/types/candidate-application';
import { formatRelativeDay } from '@/utils/datetime';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type CandidateAppliedJobsPanelProps = {
  selectedCompanyId?: number;
};

const STATUS_VARIANT: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  APPLIED: 'info',
  VIEWED: 'info',
  IN_REVIEW: 'warning',
  INTERVIEW: 'warning',
  OFFER: 'success',
  HIRED: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'default',
  JOB_CLOSED: 'default',
  DRAFT: 'default',
};

const STATUS_LABEL: Record<string, string> = {
  APPLIED: 'Applied',
  VIEWED: 'Viewed',
  IN_REVIEW: 'In Review',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  JOB_CLOSED: 'Closed',
  DRAFT: 'Draft',
};

export default function CandidateAppliedJobsPanel({ selectedCompanyId }: CandidateAppliedJobsPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'applications', 'connect-panel'],
    queryFn: () => candidateApplicationApi.list(0, 20),
  });

  const allApplications = (data?.items ?? []) as Array<Omit<CandidateApplication, 'answers'>>;

  // If a company is selected, show jobs applied at that company first, or filter
  const applications = selectedCompanyId
    ? allApplications.filter((app) => app.companyId === selectedCompanyId)
    : allApplications;

  return (
    <div className="border-outline-variant hidden h-full w-80 shrink-0 flex-col border-l bg-white lg:flex">
      {/* Header */}
      <div className="border-outline-variant border-b px-4 py-3.5">
        <p className="text-label-md text-on-surface-variant font-bold tracking-wide uppercase">APPLIED JOBS</p>
        <p className="text-label-sm text-on-surface-variant mt-0.5">
          {selectedCompanyId ? 'Your applications at this company' : 'Recent job applications'}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : applications.length === 0 ? (
          <div className="py-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-500">No applications found</p>
            <p className="text-xs text-slate-400">
              {selectedCompanyId ? 'No applications for this company.' : 'You have not applied for any jobs yet.'}
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              href={`${ROUTES.JOBS}/${app.jobId}`}
              className="hover:border-primary border-outline-variant block rounded-xl border bg-slate-50/50 p-3 transition-colors hover:bg-white"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-xs font-bold text-slate-800">{app.jobTitle}</p>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              </div>

              <p className="mt-1 truncate text-xs text-slate-500">{app.companyName}</p>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <Badge variant={STATUS_VARIANT[app.status] ?? 'default'}>
                  {STATUS_LABEL[app.status] ?? app.status}
                </Badge>
                {app.submittedAt && <span className="text-slate-400">{formatRelativeDay(app.submittedAt)}</span>}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Bottom Action Button (Image 2 and 3 style) */}
      <div className="border-outline-variant border-t p-3">
        <Link
          href={ROUTES.CANDIDATE_SAVED_JOBS}
          className="border-outline-variant text-on-surface hover:bg-surface-container-low flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-semibold transition-colors"
        >
          Manage applied jobs
        </Link>
      </div>
    </div>
  );
}
