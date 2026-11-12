'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { JOB_PAGE_SIZE, JOB_SEGMENT_META, JOB_SORT_OPTIONS } from '@/constants/recruiter-job';
import { ROUTES } from '@/constants/routes';
import { useJobPostActions } from '@/hooks/useJobPostActions';
import { useRecruiterJobCounts, useRecruiterJobList } from '@/hooks/useRecruiterJobs';
import type { RecruiterJobPost, RecruiterJobSegment, RecruiterJobSort } from '@/types/recruiter-job';
import { getErrorMessage } from '@/utils/error';
import { summaryToJobPost } from '@/utils/recruiter-job';
import { FilePlus, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import JobHistoryModal from './JobHistoryModal';
import JobStatsModal from './JobStatsModal';
import JobPostsBulkBar from './JobPostsBulkBar';
import JobPostsFilterBar from './JobPostsFilterBar';
import JobPostsList from './JobPostsList';
import JobPostsSegmentTabs from './JobPostsSegmentTabs';
import RenewJobModal from './RenewJobModal';
import JobPostsStatsRow from './JobPostsStatsRow';

interface ConfirmRequest {
  title: string;
  message: string;
  run: () => void;
}

const SEGMENTS = Object.keys(JOB_SEGMENT_META) as RecruiterJobSegment[];

export default function JobPostsListView() {
  const actions = useJobPostActions();
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<RecruiterJobSegment>('all');
  const [sort, setSort] = useState<RecruiterJobSort>('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [renewingJob, setRenewingJob] = useState<RecruiterJobPost | null>(null);
  const [historyJob, setHistoryJob] = useState<RecruiterJobPost | null>(null);
  const [statsJob, setStatsJob] = useState<RecruiterJobPost | null>(null);

  const listQuery = useRecruiterJobList({
    status: JOB_SEGMENT_META[segment].status,
    q: search,
    sort: JOB_SORT_OPTIONS.find((option) => option.value === sort)?.param,
    page: page - 1,
    size: JOB_PAGE_SIZE,
  });
  const countsQuery = useRecruiterJobCounts();

  const jobs = useMemo(() => (listQuery.data?.items ?? []).map(summaryToJobPost), [listQuery.data]);
  const totalItems = listQuery.data?.totalItems ?? 0;
  const pageCount = Math.max(1, listQuery.data?.totalPages ?? 1);

  const segmentCounts = useMemo(() => {
    const counts = {} as Record<RecruiterJobSegment, number>;
    for (const key of SEGMENTS) {
      const status = JOB_SEGMENT_META[key].status;
      counts[key] = status ? (countsQuery.data?.byStatus[status] ?? 0) : (countsQuery.data?.total ?? 0);
    }
    return counts;
  }, [countsQuery.data]);

  const isFiltered = search.trim() !== '' || segment !== 'all';
  const isAllSelected = jobs.length > 0 && jobs.every((job) => selectedIds.has(job.id));

  const resetSelection = () => setSelectedIds(new Set());

  const changeFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
      resetSelection();
    };

  const toggleSelect = (id: string) =>
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds((previous) => {
      const next = new Set(previous);
      jobs.forEach((job) => (isAllSelected ? next.delete(job.id) : next.add(job.id)));
      return next;
    });

  const runBulk = async (task: (ids: string[]) => Promise<void>) => {
    await task(Array.from(selectedIds));
    resetSelection();
  };

  const handleConfirm = () => {
    confirm?.run();
    setConfirm(null);
  };

  return (
    <div className="space-y-5">
      <JobPostsStatsRow counts={countsQuery.data} currentSegment={segment} onSelectSegment={changeFilter(setSegment)} />

      <JobPostsSegmentTabs segment={segment} onSegmentChange={changeFilter(setSegment)} counts={segmentCounts} />

      <JobPostsFilterBar
        search={search}
        onSearchChange={changeFilter(setSearch)}
        sort={sort}
        onSortChange={changeFilter(setSort)}
      />

      {listQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : listQuery.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-700">{getErrorMessage(listQuery.error)}</p>
          <Button variant="outline" size="sm" onClick={() => listQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="border-outline-variant flex flex-col items-center justify-center gap-3 rounded-xl border bg-white px-6 py-16 text-center">
          {isFiltered ? (
            <>
              <div className="bg-surface-container-high text-outline flex h-14 w-14 items-center justify-center rounded-xl">
                <SearchX className="h-7 w-7" />
              </div>
              <h3 className="text-navy text-base font-bold">No matching job posts found</h3>
              <p className="text-on-surface-variant max-w-md text-xs">
                Try a different keyword or switch to another group.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSegment('all');
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            </>
          ) : (
            <>
              <div className="bg-primary-light text-primary flex h-14 w-14 items-center justify-center rounded-xl">
                <FilePlus className="h-7 w-7" />
              </div>
              <h3 className="text-navy text-base font-bold">You have no job posts yet</h3>
              <p className="text-on-surface-variant max-w-md text-xs">
                Post your first job to start reaching quality IT candidates on InterVue.
              </p>
              <Link href={ROUTES.RECRUITER_JOBS_CREATE} className="mt-2">
                <Button leftIcon={<Plus className="h-4 w-4" />}>Post a job</Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <JobPostsList
            jobs={jobs}
            actions={actions}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={toggleSelectAll}
            isAllSelected={isAllSelected}
            onConfirm={setConfirm}
            onRenew={setRenewingJob}
            onHistory={setHistoryJob}
            onStats={setStatsJob}
          />
          <div className="border-outline-variant rounded-xl border bg-white p-3.5 sm:p-4">
            <Pagination
              page={page}
              pageCount={pageCount}
              totalItems={totalItems}
              pageSize={JOB_PAGE_SIZE}
              onPageChange={(next) => {
                setPage(next);
                resetSelection();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      <JobPostsBulkBar
        selectedCount={selectedIds.size}
        onPauseSelected={() => runBulk(actions.bulkPauseJobs)}
        onCloseSelected={() =>
          setConfirm({
            title: 'Close the selected job posts?',
            message: `${selectedIds.size} job post(s) will stop accepting applications. You can renew them later to repost.`,
            run: () => runBulk(actions.bulkCloseJobs),
          })
        }
        onDeselectAll={resetSelection}
        isPending={actions.pendingId === 'bulk'}
      />

      <RenewJobModal key={renewingJob?.id ?? 'renew'} job={renewingJob} onClose={() => setRenewingJob(null)} />
      <JobHistoryModal key={historyJob?.id ?? 'history'} job={historyJob} onClose={() => setHistoryJob(null)} />
      <JobStatsModal key={statsJob?.id ?? 'stats'} job={statsJob} onClose={() => setStatsJob(null)} />

      <Modal
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm?.title}
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        }
      >
        <p className="text-on-surface-variant text-sm">{confirm?.message}</p>
      </Modal>
    </div>
  );
}
