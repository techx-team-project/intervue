'use client';

import AdminJobApproveModal from '@/components/admin/jobs/AdminJobApproveModal';
import AdminJobContentWarnings, { rejectionReasonFor } from '@/components/admin/jobs/AdminJobContentWarnings';
import AdminJobPreviewModal from '@/components/admin/jobs/AdminJobPreviewModal';
import AdminJobReasonDialog from '@/components/admin/jobs/AdminJobReasonDialog';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import { Button } from '@/components/ui/Button';
import { JOB_FORM_LEVEL_OPTIONS } from '@/constants/recruiter-job';
import { adminJobApi } from '@/apiRequest/admin-job';
import { useAdminJobList, useAdminJobModeration } from '@/hooks/useAdminJobs';
import type { AdminJobSummaryResource } from '@/types/admin-job';
import { formatDate, formatWaitingTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { formatSalary } from '@/utils/public-company';
import { optionLabel } from '@/utils/recruiter-job';
import { CalendarClock, Check, Clock, Eye, Inbox, MapPin, ShieldAlert, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 5;

function Fact({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <span className="text-on-surface-variant inline-flex items-center gap-1 text-xs">
      <Icon className="text-outline h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

export default function AdminJobReviewQueue() {
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminJobSummaryResource | null>(null);
  const [approving, setApproving] = useState<AdminJobSummaryResource | null>(null);
  const [rejecting, setRejecting] = useState<AdminJobSummaryResource | null>(null);
  const [rejectionDraft, setRejectionDraft] = useState('');

  const list = useAdminJobList({ status: 'PENDING_REVIEW', sort: 'updatedAt,asc', page: page - 1, size: PAGE_SIZE });
  const { approve, reject } = useAdminJobModeration();

  const jobs = list.data?.items ?? [];
  const totalItems = list.data?.totalItems ?? 0;

  const afterDecision = () => {
    if (jobs.length === 1 && page > 1) setPage(page - 1);
  };

  const openReject = async (job: AdminJobSummaryResource, withFlaggedReason: boolean) => {
    let draft = '';
    if (withFlaggedReason) {
      try {
        const warnings = await adminJobApi.contentWarnings(job.id);
        if (warnings.length > 0) draft = rejectionReasonFor(warnings);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
    setRejectionDraft(draft);
    setRejecting(job);
  };

  const confirmApprove = () => {
    if (!approving) return;
    approve.mutate(approving.id, {
      onSuccess: () => {
        toast.success('Job approved and published.');
        setApproving(null);
        afterDecision();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  const confirmReject = (reason: string) => {
    if (!rejecting) return;
    reject.mutate(
      { id: rejecting.id, reason },
      {
        onSuccess: () => {
          toast.success('Job rejected and the recruiter was notified.');
          setRejecting(null);
          afterDecision();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-xs">
      <header className="dark:border-forest-800 border-outline-variant flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-3.5">
        <div>
          <h2 className="text-navy dark:text-forest-50 text-body-md font-bold">Job posts waiting for review</h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Oldest first. Approved posts go live right away, rejected posts return to the recruiter with your reason.
          </p>
        </div>
        <span className="text-label-sm text-outline">{totalItems} waiting</span>
      </header>

      {list.isLoading ? (
        <div className="flex justify-center py-14">
          <Spinner />
        </div>
      ) : list.isError ? (
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
          <p className="text-sm font-semibold text-rose-700">{getErrorMessage(list.error)}</p>
          <Button variant="outline" size="sm" onClick={() => list.refetch()}>
            Try again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <Inbox className="text-outline h-7 w-7" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">No job posts are waiting</p>
          <p className="text-body-sm text-outline">New submissions from recruiters appear here.</p>
        </div>
      ) : (
        <>
          <ul className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
            {jobs.map((job) => (
              <li key={job.id} className="space-y-3 px-4 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3.5">
                    <CompanyLogo name={job.companyName} className="h-12 w-12 shrink-0 rounded-xl" />
                    <div className="min-w-0 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setViewing(job)}
                        className="text-navy dark:text-forest-50 block max-w-full cursor-pointer truncate text-left text-sm font-bold hover:underline"
                      >
                        {job.title}
                      </button>
                      <p className="text-on-surface-variant truncate text-xs font-medium">{job.companyName}</p>
                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
                        {job.level && (
                          <span className="bg-surface-container-high text-label-sm text-on-surface rounded-md px-1.5 py-0.5 font-semibold">
                            {optionLabel(JOB_FORM_LEVEL_OPTIONS, job.level)}
                          </span>
                        )}
                        {job.city && <Fact icon={MapPin}>{job.city}</Fact>}
                        <Fact icon={Wallet}>{formatSalary(job.salary)}</Fact>
                        {job.deadline && <Fact icon={CalendarClock}>Deadline {formatDate(job.deadline)}</Fact>}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2.5 lg:items-end">
                    <span className="text-label-sm text-outline inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden />
                      Waiting {formatWaitingTime(job.updatedAt)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                        onClick={() => setViewing(job)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<X className="h-4 w-4" />}
                        onClick={() => openReject(job, false)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ShieldAlert className="h-4 w-4" />}
                        onClick={() => openReject(job, true)}
                      >
                        Reject for flagged content
                      </Button>
                      <Button size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setApproving(job)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
                <AdminJobContentWarnings jobId={job.id} />
              </li>
            ))}
          </ul>

          <div className="dark:border-forest-800 border-outline-variant border-t px-4 py-3">
            <Pagination
              page={page}
              pageCount={Math.max(1, list.data?.totalPages ?? 1)}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {viewing && <AdminJobPreviewModal jobId={viewing.id} onClose={() => setViewing(null)} />}

      {rejecting && (
        <AdminJobReasonDialog
          title="Reject this job?"
          description={`"${rejecting.title}" returns to the recruiter's drafts with your reason.`}
          confirmLabel="Reject job"
          placeholder="Tell the recruiter what to fix before submitting again"
          initialReason={rejectionDraft}
          isPending={reject.isPending}
          onClose={() => setRejecting(null)}
          onConfirm={confirmReject}
        />
      )}

      <AdminJobApproveModal
        job={approving}
        isPending={approve.isPending}
        onClose={() => setApproving(null)}
        onConfirm={confirmApprove}
      />
    </section>
  );
}
