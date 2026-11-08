'use client';

import PageHero from '@/components/common/PageHero';
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
    <>
      <PageHero
        id="jobs-title"
        eyebrow="Tìm việc làm"
        title="Việc làm IT mới nhất"
        description={
          query.data
            ? `${query.data.totalItems.toLocaleString('vi-VN')} vị trí đang chờ ứng viên trên InterVue.`
            : 'Lọc theo công nghệ, cấp bậc, địa điểm và mức lương.'
        }
        crumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Việc làm' }]}
        overlap
      />

      <div className="container-page relative -mt-16 space-y-6 pb-16">
        <PublicJobsFilterBar key={filters.q} filters={filters} onChange={(patch) => navigate(patch)} />

        {query.isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : query.isError ? (
          <div className="border-error/30 bg-error/10 flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center">
            <p className="text-error text-sm font-semibold">{getErrorMessage(query.error)}</p>
            <Button variant="outline" size="sm" onClick={() => query.refetch()}>
              Thử lại
            </Button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="border-outline-variant flex flex-col items-center gap-2 rounded-2xl border bg-white px-6 py-16 text-center">
            <SearchX className="text-outline h-9 w-9" />
            <p className="text-on-surface text-sm font-semibold">Chưa có việc làm phù hợp</p>
            <p className="text-on-surface-variant text-xs">Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <PublicJobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="border-outline-variant rounded-2xl border bg-white p-3.5 shadow-2xs">
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
    </>
  );
}
