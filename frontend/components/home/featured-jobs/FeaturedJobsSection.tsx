'use client';

import Spinner from '@/components/common/Spinner';
import PublicJobCard from '@/components/jobs/PublicJobCard';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { cn } from '@/lib/utils';
import { ArrowRight, Briefcase, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FEATURED_COUNT = 9;

const CITY_FILTERS = [
  { id: '', label: 'Mới nhất' },
  { id: 'Hà Nội', label: 'Hà Nội' },
  { id: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { id: 'Đà Nẵng', label: 'Đà Nẵng' },
];

export default function FeaturedJobsSection() {
  const [city, setCity] = useState('');
  const { data, isLoading, isError } = usePublicJobs({ city, size: FEATURED_COUNT });
  const jobs = data?.items ?? [];

  return (
    <section id="feature-jobs" className="container-topcv my-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase sm:text-3xl">
          Việc làm <span className="text-primary">nổi bật</span>
        </h2>

        <Link
          href="/jobs"
          className="group bg-primary inline-flex items-center gap-2 rounded-xl px-4.5 py-2 text-sm font-extrabold text-white shadow-xs transition duration-200 hover:bg-emerald-600 sm:px-5 sm:py-2.5"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mb-5 flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
          <Filter className="text-primary h-3.5 w-3.5" />
          Lọc theo:
        </span>
        {CITY_FILTERS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setCity(item.id)}
            className={cn(
              'shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs transition',
              city === item.id
                ? 'bg-primary font-bold text-white shadow-xs'
                : 'hover:text-primary border border-slate-200 bg-white font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Spinner />
        </div>
      ) : isError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm font-semibold text-rose-700">
          Không tải được danh sách việc làm. Vui lòng thử lại sau.
        </p>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <Briefcase className="h-9 w-9 text-slate-300" aria-hidden />
          <p className="text-sm font-semibold text-slate-700">Chưa có tin tuyển dụng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <PublicJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
