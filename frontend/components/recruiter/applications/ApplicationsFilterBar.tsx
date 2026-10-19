'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  AI_MATCH_BAND_OPTIONS,
  APPLICATION_SORT_OPTIONS,
  APPLICATION_SOURCE_LABEL,
} from '@/constants/application-status';
import { cn } from '@/lib/utils';
import { MOCK_RECRUITER_JOB_POSTS } from '@/mocks/job.mock';
import type { ApplicationFilters, ApplicationSource, ApplicationSortKey } from '@/types/recruiter-application';
import { Bookmark, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ApplicationsFilterBarProps {
  filters: ApplicationFilters;
  resultCount: number;
  onFilterChange: <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => void;
  onReset: () => void;
}

const DEBOUNCE_MS = 300;

const JOB_OPTIONS = [
  { value: '', label: 'Tất cả tin tuyển dụng' },
  ...MOCK_RECRUITER_JOB_POSTS.map((job) => ({ value: job.id, label: job.title })),
];

const SOURCE_OPTIONS = [
  { value: '', label: 'Mọi nguồn hồ sơ' },
  ...(Object.keys(APPLICATION_SOURCE_LABEL) as ApplicationSource[]).map((source) => ({
    value: source,
    label: APPLICATION_SOURCE_LABEL[source],
  })),
];

export default function ApplicationsFilterBar({
  filters,
  resultCount,
  onFilterChange,
  onReset,
}: ApplicationsFilterBarProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => onFilterChange('search', searchDraft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const hasActiveFilter =
    filters.search !== '' ||
    filters.jobId !== '' ||
    filters.aiMatchBand !== 'ALL' ||
    filters.source !== '' ||
    filters.savedOnly ||
    filters.sort !== 'NEWEST';

  return (
    <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5 shadow-xs">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Tìm theo tên ứng viên, vị trí, email hoặc kỹ năng..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-2.5">
          <Select
            value={filters.jobId}
            onChange={(event) => onFilterChange('jobId', event.target.value)}
            options={JOB_OPTIONS}
            aria-label="Lọc theo tin tuyển dụng"
          />

          <Select
            value={filters.aiMatchBand}
            onChange={(event) => onFilterChange('aiMatchBand', event.target.value as ApplicationFilters['aiMatchBand'])}
            options={AI_MATCH_BAND_OPTIONS}
            aria-label="Lọc theo điểm phù hợp AI"
          />

          <Select
            value={filters.source}
            onChange={(event) => onFilterChange('source', event.target.value as ApplicationSource | '')}
            options={SOURCE_OPTIONS}
            aria-label="Lọc theo nguồn hồ sơ"
          />

          <Select
            value={filters.sort}
            onChange={(event) => onFilterChange('sort', event.target.value as ApplicationSortKey)}
            options={APPLICATION_SORT_OPTIONS}
            aria-label="Sắp xếp hồ sơ"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1f5f9] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterChange('savedOnly', !filters.savedOnly)}
            aria-pressed={filters.savedOnly}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors',
              filters.savedOnly
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <Bookmark className={cn('h-3.5 w-3.5', filters.savedOnly && 'fill-current')} />
            Chỉ ứng viên đã lưu
          </button>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setSearchDraft('');
                onReset();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-bold text-[#64748b] transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Xoá bộ lọc
            </button>
          )}
        </div>

        <p className="text-[12px] font-semibold text-[#64748b]">
          Đang hiển thị <span className="text-navy font-black">{resultCount}</span> hồ sơ
        </p>
      </div>
    </div>
  );
}
