'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { JOB_SORT_OPTIONS } from '@/constants/recruiter-job';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { RecruiterJobSort } from '@/types/recruiter-job';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 300;

interface JobPostsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: RecruiterJobSort;
  onSortChange: (value: RecruiterJobSort) => void;
}

export default function JobPostsFilterBar({ search, onSearchChange, sort, onSortChange }: JobPostsFilterBarProps) {
  const [draft, setDraft] = useState(search);
  const debounced = useDebouncedValue(draft, DEBOUNCE_MS);

  useEffect(() => {
    if (debounced !== search) onSearchChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by job title…"
          aria-label="Search job posts"
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="sm:w-52">
        <Select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as RecruiterJobSort)}
          aria-label="Sort"
          options={JOB_SORT_OPTIONS.map(({ value, label }) => ({ value, label }))}
        />
      </div>
    </div>
  );
}
