'use client';

import EmptyState from '@/components/common/EmptyState';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import Reveal from '@/components/ui/Reveal';
import Skeleton from '@/components/ui/Skeleton';
import { useFeaturedCompanies } from '@/hooks/useFeaturedCompanies';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import type { PublicJobCompany } from '@/types/public-job';
import { ArrowUpRight, WifiOff } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader';

const SAMPLE_SIZE = 30;
const COMPANY_COUNT = 8;

type CompanyEntry = { company: PublicJobCompany; jobCount: number; featured?: boolean };

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
  const featured = useFeaturedCompanies(COMPANY_COUNT);

  // Companies that paid for the Featured slot take the front; the rest fills from recent job posts
  const paid: CompanyEntry[] = (featured.data ?? []).map((company) => ({
    company: { id: company.id, name: company.name, logoUrl: company.logoUrl ?? undefined },
    jobCount: 0,
    featured: true,
  }));
  const paidIds = new Set(paid.map((entry) => entry.company.id));
  const organic = groupCompanies((query.data?.items ?? []).map((job) => job.company)).filter(
    (entry) => !paidIds.has(entry.company.id),
  );
  const entries = [...paid, ...organic].slice(0, COMPANY_COUNT);

  if (!query.isLoading && !query.isError && entries.length === 0) return null;

  return (
    <section id="top-companies" aria-labelledby="companies-title" className="bg-surface-container-low py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="companies-title"
            eyebrow="Hiring companies"
            title="Companies looking for you"
            description="Companies with the latest job posts on InterVue."
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
            title="Could not load the company list"
            actionLabel="Try again"
            onAction={() => query.refetch()}
            className="bg-surface"
          />
        ) : (
          <Reveal delay={1}>
            <ul className="expanded:grid-cols-4 medium:grid-cols-2 grid grid-cols-1 gap-4">
              {entries.map(({ company, jobCount, featured }) => (
                <li key={company.id}>
                  <Link
                    href={`/companies/${company.id}`}
                    className="group bg-surface ease-standard hover:shadow-card flex h-full flex-col gap-5 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <CompanyLogo name={company.name} src={company.logoUrl} className="h-16 w-16 rounded-2xl" />
                      <span className="flex items-center gap-2">
                        {featured && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            Nổi bật
                          </span>
                        )}
                        <ArrowUpRight
                          className="text-outline ease-standard group-hover:text-primary h-5 w-5 transition-all duration-300"
                          aria-hidden
                        />
                      </span>
                    </div>
                    <p className="text-title-md text-on-surface line-clamp-2 font-bold uppercase">{company.name}</p>
                    {jobCount > 0 && (
                      <p className="text-body-md text-primary mt-auto font-semibold">{jobCount} new jobs</p>
                    )}
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
