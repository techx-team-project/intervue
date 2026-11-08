'use client';

import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import { Search } from 'lucide-react';
import { useState } from 'react';

export interface PublicJobFilters {
  q: string;
  city: string;
  level: string;
  contractType: string;
  workingArrangement: string;
  salaryFrom: string;
}

const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
const MILLION = 1_000_000;
const SALARY_STEPS = [10, 20, 30, 50];

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const SELECTS: Array<{
  key: keyof PublicJobFilters;
  label: string;
  options: Array<{ value: string; label: string }>;
}> = [
  { key: 'city', label: 'Địa điểm', options: CITIES.map((city) => ({ value: city, label: city })) },
  { key: 'level', label: 'Cấp bậc', options: toOptions(JOB_LEVEL_LABELS) },
  { key: 'contractType', label: 'Loại hợp đồng', options: toOptions(JOB_CONTRACT_LABELS) },
  { key: 'workingArrangement', label: 'Hình thức', options: toOptions(JOB_ARRANGEMENT_LABELS) },
  {
    key: 'salaryFrom',
    label: 'Mức lương',
    options: SALARY_STEPS.map((step) => ({ value: String(step * MILLION), label: `Từ ${step} triệu` })),
  },
];

interface PublicJobsFilterBarProps {
  filters: PublicJobFilters;
  onChange: (patch: Partial<PublicJobFilters>) => void;
}

export default function PublicJobsFilterBar({ filters, onChange }: PublicJobsFilterBarProps) {
  const [keyword, setKeyword] = useState(filters.q);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-surface shadow-card space-y-3 rounded-3xl p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onChange({ q: keyword });
        }}
        className="flex gap-2"
      >
        <label className="relative flex-1">
          <Search className="text-outline pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Vị trí tuyển dụng, tên công ty"
            aria-label="Từ khóa tìm kiếm"
            className="border-outline focus:border-primary h-11 w-full rounded-xl border bg-white pr-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover h-11 cursor-pointer rounded-xl px-5 text-sm font-bold text-white transition"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {SELECTS.map((select) => (
          <select
            key={select.key}
            value={filters[select.key]}
            onChange={(event) => onChange({ [select.key]: event.target.value })}
            aria-label={select.label}
            className="border-outline text-on-surface focus:border-primary h-10 rounded-xl border bg-white px-3 text-xs font-medium focus:outline-none"
          >
            <option value="">{select.label}</option>
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            onChange({ q: '', city: '', level: '', contractType: '', workingArrangement: '', salaryFrom: '' });
          }}
          className="text-primary cursor-pointer text-xs font-semibold hover:underline"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
