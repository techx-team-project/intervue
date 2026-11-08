'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import PublicJobCard from '@/components/jobs/PublicJobCard';
import { Button } from '@/components/ui/Button';
import { useFollowedCompanies, useSavedJobs } from '@/hooks/useCandidateSaved';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/error';
import Link from 'next/link';
import { useState } from 'react';
import FollowedCompanyCard from './FollowedCompanyCard';
import SavedJobUnavailableCard from './SavedJobUnavailableCard';

const PAGE_SIZE = 12;

type Tab = 'jobs' | 'companies';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'jobs', label: 'Việc làm đã lưu' },
  { value: 'companies', label: 'Công ty theo dõi' },
];

function Feedback({ isLoading, error, onRetry }: { isLoading: boolean; error: unknown; onRetry: () => void }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
      <Button variant="outline" onClick={onRetry}>
        Thử lại
      </Button>
    </div>
  );
}

function Empty({ title, hint, href, cta }: { title: string; hint: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <Link href={href} className="mt-4 inline-block">
        <Button size="sm">{cta}</Button>
      </Link>
    </div>
  );
}

function SavedJobsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useSavedJobs(page - 1, PAGE_SIZE);

  if (isLoading || isError) return <Feedback isLoading={isLoading} error={error} onRetry={() => refetch()} />;
  if (!data || data.items.length === 0) {
    return (
      <Empty
        title="Bạn chưa lưu việc làm nào"
        hint="Bấm biểu tượng trái tim trên tin tuyển dụng để lưu lại xem sau."
        href="/jobs"
        cta="Tìm việc làm"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.items.map((saved) =>
          saved.job ? (
            <PublicJobCard key={saved.jobId} job={saved.job} />
          ) : (
            <SavedJobUnavailableCard key={saved.jobId} jobId={saved.jobId} />
          ),
        )}
      </div>
      <Pagination
        page={page}
        pageCount={data.totalPages}
        totalItems={data.totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

function FollowedCompaniesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useFollowedCompanies(page - 1, PAGE_SIZE);

  if (isLoading || isError) return <Feedback isLoading={isLoading} error={error} onRetry={() => refetch()} />;
  if (!data || data.items.length === 0) {
    return (
      <Empty
        title="Bạn chưa theo dõi công ty nào"
        hint="Theo dõi công ty để nhận thông báo ngay khi họ đăng tin tuyển dụng mới."
        href="/jobs"
        cta="Khám phá việc làm"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.items.map((followed) => (
          <FollowedCompanyCard key={followed.companyId} followed={followed} />
        ))}
      </div>
      <Pagination
        page={page}
        pageCount={data.totalPages}
        totalItems={data.totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

export default function SavedItemsView({ initialTab = 'jobs' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="container-page space-y-5 py-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">Đã lưu và theo dõi</h1>
        <p className="mt-1 text-sm text-slate-500">
          Xem lại việc làm bạn quan tâm và các công ty bạn muốn nhận tin tuyển dụng mới.
        </p>
      </header>

      <div className="flex gap-2" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => setTab(item.value)}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              tab === item.value
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'jobs' ? <SavedJobsTab /> : <FollowedCompaniesTab />}
    </div>
  );
}
