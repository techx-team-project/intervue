'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { JobStatus } from '@/types/recruiter-job';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { JOB_STATUS_META } from './JobPostStatusBadge';

interface JobPostsFilterBarProps {
  search: string;
  status: JobStatus | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: JobStatus | '') => void;
}

const STATUS_OPTIONS = (Object.keys(JOB_STATUS_META) as JobStatus[]).map((status) => ({
  value: status,
  label: JOB_STATUS_META[status].label,
}));

const DEBOUNCE_MS = 300;

export default function JobPostsFilterBar({ search, status, onSearchChange, onStatusChange }: JobPostsFilterBarProps) {
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search by job post title..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="w-full sm:w-56">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as JobStatus | '')}
          placeholder="All statuses"
          options={STATUS_OPTIONS}
        />
      </div>
    </div>
  );
}
