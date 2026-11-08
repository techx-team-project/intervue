'use client';

import EmptyState from '@/components/common/EmptyState';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import type { PublicJobCompany } from '@/types/public-job';
import { Briefcase, WifiOff } from 'lucide-react';
import Link from 'next/link';

const SAMPLE_SIZE = 30;
const COMPANY_COUNT = 9;

type CompanyEntry = { company: PublicJobCompany; jobCount: number };

function groupCompanies(companies: PublicJobCompany[]): CompanyEntry[] {
  const byId = new Map<number, CompanyEntry>();
  companies.forEach((company) => {
    const entry = byId.get(company.id);
    if (entry) entry.jobCount += 1;
    else byId.set(company.id, { company, jobCount: 1 });
  });
  return Array.from(byId.values()).slice(0, COMPANY_COUNT);
}

export default function HiringCompaniesSection() {
  const query = usePublicJobs({ size: SAMPLE_SIZE });
  const entries = groupCompanies((query.data?.items ?? []).map((job) => job.company));

  if (!query.isLoading && !query.isError && entries.length === 0) return null;

  return (
    <section id="top-companies" aria-labelledby="companies-title" className="container-page py-8">
      <div className="overflow-hidden rounded-2xl">
        <div className="from-primary-deep to-primary-deeper bg-linear-to-r px-8 py-10">
          <h2 id="companies-title" className="text-headline-lg text-on-primary font-bold">
            Công ty đang tuyển
          </h2>
          <p className="text-title-md text-on-primary mt-2 font-normal">
            Doanh nghiệp có tin tuyển dụng mới nhất trên InterVue
          </p>
        </div>

        <div className="bg-surface p-6">
          {query.isLoading ? (
            <div className="expanded:grid-cols-3 medium:grid-cols-2 grid grid-cols-1 gap-4">
              {Array.from({ length: COMPANY_COUNT }, (_, index) => (
                <Skeleton key={index} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          ) : query.isError ? (
            <EmptyState
              tone="error"
              icon={WifiOff}
              title="Không tải được danh sách công ty"
              actionLabel="Thử lại"
              onAction={() => query.refetch()}
            />
          ) : (
            <ul className="expanded:grid-cols-3 medium:grid-cols-2 grid grid-cols-1 gap-4">
              {entries.map(({ company, jobCount }) => (
                <li key={company.id}>
                  <Link
                    href={`/companies/${company.id}`}
                    className="border-outline-variant hover:border-primary hover:bg-primary-light ease-standard hover:shadow-elevation-1 flex h-full flex-col gap-3 rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <CompanyLogo name={company.name} src={company.logoUrl} className="h-20 w-20 rounded-lg" />
                      <span className="text-title-md text-on-surface line-clamp-3 font-semibold uppercase">
                        {company.name}
                      </span>
                    </div>
                    <span className="text-body-lg text-on-surface mt-auto flex items-center gap-2">
                      <Briefcase className="h-4 w-4" aria-hidden />
                      {jobCount} việc làm mới
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
