'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAdminJobCounts, useAdminJobList, useAdminJobModeration } from '@/hooks/useAdminJobs';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';
import type { AdminJobSummaryResource } from '@/types/admin-job';
import type { JobStatus } from '@/types/recruiter-job';
import { getErrorMessage } from '@/utils/error';
import { Search, SearchX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AdminJobInsightsPanel from './AdminJobInsightsPanel';
import AdminJobApproveModal from './AdminJobApproveModal';
import AdminJobReasonDialog from './AdminJobReasonDialog';
import AdminJobPreviewModal from './AdminJobPreviewModal';
import AdminJobsList from './AdminJobsList';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

const TABS: Array<{ value: JobStatus | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 'PENDING_REVIEW', label: 'Pending review' },
  { value: 'PUBLISHED', label: 'Live' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'HIDDEN_BY_ADMIN', label: 'Hidden' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function AdminJobsPageClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<JobStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminJobSummaryResource | null>(null);
  const [hiding, setHiding] = useState<AdminJobSummaryResource | null>(null);
  const [restoring, setRestoring] = useState<AdminJobSummaryResource | null>(null);
  const [approving, setApproving] = useState<AdminJobSummaryResource | null>(null);
  const [rejecting, setRejecting] = useState<AdminJobSummaryResource | null>(null);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const list = useAdminJobList({ q: debouncedSearch, status, page: page - 1, size: PAGE_SIZE });
  const counts = useAdminJobCounts();
  const { hide, restore, approve, reject } = useAdminJobModeration();

  const jobs = list.data?.items ?? [];
  const totalItems = list.data?.totalItems ?? 0;

  const countOf = (value: JobStatus | undefined) =>
    value ? (counts.data?.byStatus[value] ?? 0) : (counts.data?.total ?? 0);

  const confirmHide = (reason: string) => {
    if (!hiding) return;
    hide.mutate(
      { id: hiding.id, reason },
      {
        onSuccess: () => {
          toast.success('Job hidden and the recruiter was notified.');
          setHiding(null);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const confirmApprove = () => {
    if (!approving) return;
    approve.mutate(approving.id, {
      onSuccess: () => {
        toast.success('Job approved and published.');
        setApproving(null);
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
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const confirmRestore = () => {
    if (!restoring) return;
    restore.mutate(restoring.id, {
      onSuccess: () => {
        toast.success('Job restored.');
        setRestoring(null);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        description="Review posted jobs, hide the ones that break the rules and restore them once fixed."
        count={counts.data?.total}
        countLabel="jobs"
      />

      <AdminJobInsightsPanel />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Job status" className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
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
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                status === tab.value
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low bg-white',
              )}
            >
              {tab.label} <span className="text-outline ml-0.5">{countOf(tab.value)}</span>
            </button>
          ))}
        </div>

        <label className="relative block sm:w-72">
          <Search className="text-outline pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or company"
            aria-label="Search jobs"
            className="border-outline h-10 w-full rounded-xl border bg-white pr-3 pl-9 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
          />
        </label>
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
      ) : jobs.length === 0 ? (
        <div className="border-outline-variant flex flex-col items-center gap-2 rounded-2xl border bg-white px-6 py-14 text-center">
          <SearchX className="text-outline h-8 w-8" />
          <p className="text-on-surface text-sm font-semibold">No jobs match these filters</p>
        </div>
      ) : (
        <>
          <AdminJobsList
            jobs={jobs}
            onView={setViewing}
            onHide={setHiding}
            onRestore={setRestoring}
            onApprove={setApproving}
            onReject={setRejecting}
          />
          <Pagination
            page={page}
            pageCount={Math.max(1, list.data?.totalPages ?? 1)}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {viewing && <AdminJobPreviewModal jobId={viewing.id} onClose={() => setViewing(null)} />}

      {hiding && (
        <AdminJobReasonDialog
          title="Hide this job?"
          description={`"${hiding.title}" leaves search and the recruiter is notified with your reason.`}
          confirmLabel="Hide job"
          placeholder="Tell the recruiter what to fix before the job can be restored"
          isPending={hide.isPending}
          onClose={() => setHiding(null)}
          onConfirm={confirmHide}
        />
      )}

      {rejecting && (
        <AdminJobReasonDialog
          title="Reject this job?"
          description={`"${rejecting.title}" returns to the recruiter's drafts with your reason.`}
          confirmLabel="Reject job"
          placeholder="Tell the recruiter what to fix before submitting again"
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

      <Modal
        isOpen={restoring !== null}
        onClose={() => setRestoring(null)}
        maxWidth="sm"
        title="Restore this job?"
        description={restoring ? `"${restoring.title}" returns to search if its deadline has not passed.` : undefined}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRestoring(null)} disabled={restore.isPending}>
              Cancel
            </Button>
            <Button isLoading={restore.isPending} onClick={confirmRestore}>
              Restore
            </Button>
          </div>
        }
      >
        <p className="text-on-surface-variant text-sm">The recruiter is notified when the job is restored.</p>
      </Modal>
    </div>
  );
}
