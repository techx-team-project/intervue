'use client';

import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { JOB_PAGE_SIZE } from '@/constants/recruiter-job';
import { ROUTES } from '@/constants/routes';
import { useJobPostActions } from '@/hooks/useJobPostActions';
import type { RecruiterJobPost, RecruiterJobSegment, RecruiterJobSort } from '@/types/recruiter-job';
import { FilePlus, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import JobPostsBulkBar from './JobPostsBulkBar';
import JobPostsFilterBar from './JobPostsFilterBar';
import JobPostsSegmentTabs from './JobPostsSegmentTabs';
import JobPostsStatsRow from './JobPostsStatsRow';
import JobPostsTable from './JobPostsTable';

interface JobPostsListViewProps {
  initialJobs: RecruiterJobPost[];
}

export default function JobPostsListView({ initialJobs }: JobPostsListViewProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const actions = useJobPostActions(setJobs);

  // Filters & State
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<RecruiterJobSegment>('all');
  const [level, setLevel] = useState('ALL');
  const [arrangement, setArrangement] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [sort, setSort] = useState<RecruiterJobSort>('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Check if filters differ from default
  const isFiltered = useMemo(() => {
    return search.trim() !== '' || level !== 'ALL' || arrangement !== 'ALL' || location !== 'ALL' || sort !== 'newest';
  }, [search, level, arrangement, location, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setLevel('ALL');
    setArrangement('ALL');
    setLocation('ALL');
    setSort('newest');
    setPage(1);
  };

  // Live counts for segment tabs
  const segmentCounts = useMemo(() => {
    const counts: Record<RecruiterJobSegment, number> = {
      all: jobs.length,
      published: 0,
      pending: 0,
      paused: 0,
      expired: 0,
      draft: 0,
      closed: 0,
    };

    for (const job of jobs) {
      if (job.status === 'PUBLISHED') counts.published += 1;
      else if (job.status === 'PENDING_REVIEW') counts.pending += 1;
      else if (job.status === 'PAUSED') counts.paused += 1;
      else if (job.status === 'EXPIRED') counts.expired += 1;
      else if (job.status === 'DRAFT') counts.draft += 1;
      else if (job.status === 'CLOSED') counts.closed += 1;
    }

    return counts;
  }, [jobs]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = jobs.filter((job) => {
      // 1. Segment filter
      if (segment === 'published' && job.status !== 'PUBLISHED') return false;
      if (segment === 'pending' && job.status !== 'PENDING_REVIEW') return false;
      if (segment === 'paused' && job.status !== 'PAUSED') return false;
      if (segment === 'expired' && job.status !== 'EXPIRED') return false;
      if (segment === 'draft' && job.status !== 'DRAFT') return false;
      if (segment === 'closed' && job.status !== 'CLOSED') return false;

      // 2. Search keyword filter (title, skills, id)
      if (query) {
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesId = job.id.toLowerCase().includes(query);
        const matchesSkill = job.skills?.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesId && !matchesSkill) return false;
      }

      // 3. Level filter
      if (level !== 'ALL' && job.level !== level) return false;

      // 4. Arrangement filter
      if (arrangement !== 'ALL' && job.workingArrangement !== arrangement) return false;

      // 5. Location filter
      if (location !== 'ALL' && !job.location.city.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort pipeline
    return result.sort((a, b) => {
      if (sort === 'expiringSoon') {
        const timeA = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
        const timeB = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
        return timeA - timeB;
      }

      if (sort === 'mostApplicants') {
        const appsA = a.applicantsCount ?? 0;
        const appsB = b.applicantsCount ?? 0;
        return appsB - appsA;
      }

      if (sort === 'highestSalary') {
        const salA = a.salary.max ?? a.salary.min ?? 0;
        const salB = b.salary.max ?? b.salary.min ?? 0;
        return salB - salA;
      }

      // Default: 'newest' by updatedAt / createdAt
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [jobs, segment, search, level, arrangement, location, sort]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / JOB_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOB_PAGE_SIZE;
    return filteredJobs.slice(startIndex, startIndex + JOB_PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  // Selection handlers
  const isAllSelected = useMemo(() => {
    if (paginatedJobs.length === 0) return false;
    return paginatedJobs.every((j) => selectedIds.has(j.id));
  }, [paginatedJobs, selectedIds]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        paginatedJobs.forEach((j) => next.delete(j.id));
      } else {
        paginatedJobs.forEach((j) => next.add(j.id));
      }
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Bulk actions
  const handleBulkPause = async () => {
    await actions.bulkPauseJobs(Array.from(selectedIds));
    handleDeselectAll();
  };

  const handleBulkExtend = async () => {
    await actions.bulkExtendJobs(Array.from(selectedIds));
    handleDeselectAll();
  };

  const handleBulkClose = async () => {
    await actions.bulkCloseJobs(Array.from(selectedIds));
    handleDeselectAll();
  };

  // Stat card navigation
  const handleSelectSegmentFromStats = (newSegment: RecruiterJobSegment) => {
    setSegment(newSegment);
    setPage(1);
  };

  const handleSelectSortFromStats = (newSort: RecruiterJobSort) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* 1. KPI Stats Metric Cards */}
      <JobPostsStatsRow
        jobs={jobs}
        currentSegment={segment}
        onSelectSegment={handleSelectSegmentFromStats}
        onSelectSort={handleSelectSortFromStats}
      />

      {/* 2. Status Segment Tabs */}
      <JobPostsSegmentTabs
        segment={segment}
        onSegmentChange={(newSeg) => {
          setSegment(newSeg);
          setPage(1);
        }}
        counts={segmentCounts}
      />

      {/* 3. Advanced Filter & Sort Bar */}
      <JobPostsFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        level={level}
        onLevelChange={(val) => {
          setLevel(val);
          setPage(1);
        }}
        arrangement={arrangement}
        onArrangementChange={(val) => {
          setArrangement(val);
          setPage(1);
        }}
        location={location}
        onLocationChange={(val) => {
          setLocation(val);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(val) => {
          setSort(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 4. Content Area: Table / Mobile Cards / Empty States */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
          {jobs.length === 0 ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FilePlus className="h-7 w-7" />
              </div>
              <h3 className="text-navy text-base font-bold">No job posts yet</h3>
              <p className="max-w-md text-xs text-slate-500">
                Publish your first job post to start reaching qualified IT candidates on InterVue.
              </p>
              <Link href={ROUTES.RECRUITER_JOBS_CREATE} className="mt-2">
                <Button leftIcon={<Plus className="h-4 w-4" />}>Post a job</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <SearchX className="h-7 w-7" />
              </div>
              <h3 className="text-navy text-base font-bold">No matching job posts found</h3>
              <p className="max-w-md text-xs text-slate-500">
                Try adjusting your search query, clearing specific filters, or switching segment tabs.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-2">
                Clear all filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <JobPostsTable
            jobs={paginatedJobs}
            actions={actions}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />

          {/* 5. Pagination */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4">
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              totalItems={filteredJobs.length}
              pageSize={JOB_PAGE_SIZE}
              onPageChange={(newPage) => {
                setPage(newPage);
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* 6. Floating Bulk Actions Bar */}
      <JobPostsBulkBar
        selectedCount={selectedIds.size}
        onPauseSelected={handleBulkPause}
        onExtendSelected={handleBulkExtend}
        onCloseSelected={handleBulkClose}
        onDeselectAll={handleDeselectAll}
        isPending={actions.pendingId === 'bulk'}
      />
    </div>
  );
}
