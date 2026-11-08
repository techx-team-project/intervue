'use client';

import EmptyState from '@/components/common/EmptyState';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import Reveal from '@/components/ui/Reveal';
import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import type { PublicJobCompany } from '@/types/public-job';
import { ArrowUpRight, WifiOff } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

const SAMPLE_SIZE = 30;
const COMPANY_COUNT = 8;

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
    <section id="top-companies" aria-labelledby="companies-title" className="bg-surface-container-low py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="companies-title"
            eyebrow="Doanh nghiệp tuyển dụng"
            title="Những công ty đang tìm bạn"
            description="Doanh nghiệp có tin tuyển dụng mới nhất trên InterVue."
          />
        </Reveal>

        {query.isLoading ? (
          <div className="expanded:grid-cols-4 medium:grid-cols-2 grid grid-cols-1 gap-4">
            {Array.from({ length: COMPANY_COUNT }, (_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-3xl" />
            ))}
          </div>
        ) : query.isError ? (
          <EmptyState
            tone="error"
            icon={WifiOff}
            title="Không tải được danh sách công ty"
            actionLabel="Thử lại"
            onAction={() => query.refetch()}
            className="bg-surface"
          />
        ) : (
          <Reveal delay={1}>
            <ul className="expanded:grid-cols-4 medium:grid-cols-2 grid grid-cols-1 gap-4">
              {entries.map(({ company, jobCount }) => (
                <li key={company.id}>
                  <Link
                    href={`/companies/${company.id}`}
                    className="group bg-surface ease-standard hover:shadow-card flex h-full flex-col gap-5 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <CompanyLogo name={company.name} src={company.logoUrl} className="h-16 w-16 rounded-2xl" />
                      <ArrowUpRight
                        className="text-outline ease-standard group-hover:text-primary h-5 w-5 transition-all duration-300"
                        aria-hidden
                      />
                    </div>
                    <p className="text-title-md text-on-surface line-clamp-2 font-bold uppercase">{company.name}</p>
                    <p className="text-body-md text-primary mt-auto font-semibold">{jobCount} việc làm mới</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
