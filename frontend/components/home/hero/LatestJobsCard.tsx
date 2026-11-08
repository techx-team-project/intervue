'use client';

import CompanyLogo from '@/components/jobs/CompanyLogo';
import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { formatSalary } from '@/utils/public-company';
import Link from 'next/link';

const LATEST_COUNT = 5;

export default function LatestJobsCard() {
  const query = usePublicJobs({ size: LATEST_COUNT });
  const jobs = query.data?.items ?? [];

  return (
    <aside aria-labelledby="latest-jobs-title" className="bg-surface shadow-float rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 id="latest-jobs-title" className="font-display text-title-lg text-on-surface font-bold">
          Mới đăng gần đây
        </h2>
        <Link href="/jobs" className="text-label-lg text-primary font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-4" aria-live="polite" aria-busy={query.isFetching}>
        {query.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: LATEST_COUNT }, (_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : query.isError || jobs.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-10 text-center">
            {query.isError ? 'Chưa tải được danh sách việc làm.' : 'Chưa có tin tuyển dụng mới.'}
          </p>
        ) : (
          <ul className="divide-outline-variant divide-y">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="hover:bg-surface-container-low ease-standard -mx-3 flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-150"
                >
                  <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-12 w-12 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-title-sm text-on-surface line-clamp-1 font-bold">{job.title}</p>
                    <p className="text-body-sm text-on-surface-variant line-clamp-1">{job.company.name}</p>
                  </div>
                  <span className="text-label-lg text-primary shrink-0 font-semibold">{formatSalary(job.salary)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
