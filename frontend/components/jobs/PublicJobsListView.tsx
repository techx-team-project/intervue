'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { getErrorMessage } from '@/utils/error';
import { SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicJobCard from './PublicJobCard';
import PublicJobsFilterBar, { type PublicJobFilters } from './PublicJobsFilterBar';

const PAGE_SIZE = 12;
const FILTER_KEYS: Array<keyof PublicJobFilters> = [
  'q',
  'city',
  'level',
  'contractType',
  'workingArrangement',
  'salaryFrom',
];

export default function PublicJobsListView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? '']),
  ) as unknown as PublicJobFilters;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const query = usePublicJobs({
    q: filters.q,
    city: filters.city,
    level: filters.level,
    contractType: filters.contractType,
    workingArrangement: filters.workingArrangement,
    salaryFrom: filters.salaryFrom ? Number(filters.salaryFrom) : undefined,
    page: page - 1,
    size: PAGE_SIZE,
  });

  const navigate = (patch: Partial<PublicJobFilters>, nextPage = 1) => {
    const next = new URLSearchParams();
    const merged = { ...filters, ...patch };
    FILTER_KEYS.forEach((key) => {
      if (merged[key]) next.set(key, merged[key]);
    });
    if (nextPage > 1) next.set('page', String(nextPage));
    const qs = next.toString();
    router.replace(qs ? `/jobs?${qs}` : '/jobs', { scroll: false });
  };

  const jobs = query.data?.items ?? [];

  return (
    <div className="container-topcv space-y-5 py-6">
      <header>
        <h1 className="text-navy text-2xl font-black">Việc làm IT mới nhất</h1>
        {query.data && (
          <p className="mt-1 text-sm text-slate-500">
            <strong className="text-slate-800">{query.data.totalItems.toLocaleString('vi-VN')}</strong> vị trí đang
            tuyển
          </p>
        )}
      </header>

      <PublicJobsFilterBar key={filters.q} filters={filters} onChange={(patch) => navigate(patch)} />

      {query.isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : query.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-700">{getErrorMessage(query.error)}</p>
          <Button variant="outline" size="sm" onClick={() => query.refetch()}>
            Thử lại
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <SearchX className="h-9 w-9 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">Chưa có việc làm phù hợp</p>
          <p className="text-xs text-slate-500">Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <PublicJobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <Pagination
              page={page}
              pageCount={Math.max(1, query.data?.totalPages ?? 1)}
              totalItems={query.data?.totalItems ?? 0}
              pageSize={PAGE_SIZE}
              onPageChange={(next) => {
                navigate({}, next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
