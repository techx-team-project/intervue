'use client';

import { useJobPostActions } from '@/hooks/useJobPostActions';
import { ROUTES } from '@/constants/routes';
import type { JobStatus, RecruiterJobPost } from '@/types/recruiter-job';
import { FilePlus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import JobPostsFilterBar from './JobPostsFilterBar';
import JobPostsTable from './JobPostsTable';

interface JobPostsListViewProps {
  initialJobs: RecruiterJobPost[];
}

export default function JobPostsListView({ initialJobs }: JobPostsListViewProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<JobStatus | ''>('');
  const actions = useJobPostActions(setJobs);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === '' || job.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  return (
    <div className="space-y-4">
      <JobPostsFilterBar search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-xs">
          <FilePlus className="h-10 w-10 text-[#cbd5e1]" />
          <p className="text-navy text-[14px] font-bold">
            {jobs.length === 0 ? 'No job posts yet' : 'No matching job posts found'}
          </p>
          <p className="max-w-sm text-[12.5px] text-[#64748b]">
            {jobs.length === 0
              ? 'Publish your first job post to start reaching the right IT candidates.'
              : 'Try adjusting the keyword or the status filter.'}
          </p>
          {jobs.length === 0 && (
            <Link
              href={ROUTES.RECRUITER_JOBS_CREATE}
              className="bg-primary hover:bg-primary-hover mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white transition-colors"
            >
              Post a job
            </Link>
          )}
        </div>
      ) : (
        <JobPostsTable jobs={filteredJobs} actions={actions} />
      )}
    </div>
  );
}
