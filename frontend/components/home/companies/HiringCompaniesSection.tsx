'use client';

import EmptyState from '@/components/common/EmptyState';
import Reveal from '@/components/ui/Reveal';
import Skeleton from '@/components/ui/Skeleton';
import { useFeaturedCompanies } from '@/hooks/useFeaturedCompanies';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import type { PublicJobCompany, PublicJobSummaryResource } from '@/types/public-job';
import { WifiOff } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import HomeJobCard from '../HomeJobCard';

const SAMPLE_SIZE = 30;
const COMPANY_COUNT = 6;
const MAX_JOBS_PER_COMPANY = 2;
const CARD_COUNT = 9;
const GRID_CLASS = 'expanded:grid-cols-3 medium:grid-cols-2 grid grid-cols-1 gap-5';

type CompanyEntry = { company: PublicJobCompany; jobs: PublicJobSummaryResource[]; featured?: boolean };

function groupByCompany(jobs: PublicJobSummaryResource[]): CompanyEntry[] {
  const byId = new Map<number, CompanyEntry>();
  jobs.forEach((job) => {
    const entry = byId.get(job.company.id);
    if (entry) entry.jobs.push(job);
    else byId.set(job.company.id, { company: job.company, jobs: [job] });
  });
  return Array.from(byId.values());
}

export default function HiringCompaniesSection() {
  const query = usePublicJobs({ size: SAMPLE_SIZE });
  const featured = useFeaturedCompanies(COMPANY_COUNT);

  const grouped = groupByCompany(query.data?.items ?? []);
  const jobsByCompany = new Map(grouped.map((entry) => [entry.company.id, entry.jobs]));

  // Companies that paid for the Featured slot take the front; the rest fills from recent job posts
  const paid: CompanyEntry[] = (featured.data ?? []).map((company) => ({
    company: { id: company.id, name: company.name, logoUrl: company.logoUrl ?? undefined },
    jobs: jobsByCompany.get(company.id) ?? [],
    featured: true,
  }));
  const paidIds = new Set(paid.map((entry) => entry.company.id));
  const entries = [...paid, ...grouped.filter((entry) => !paidIds.has(entry.company.id))].slice(0, COMPANY_COUNT);
  const cards = entries.flatMap((entry) => entry.jobs.slice(0, MAX_JOBS_PER_COMPANY)).slice(0, CARD_COUNT);

  if (!query.isLoading && !query.isError && cards.length === 0) return null;

  return (
    <section id="top-companies" aria-labelledby="companies-title" className="bg-surface-container-low py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            id="companies-title"
            index="04"
            eyebrow="Hiring companies"
            title="Companies looking for you"
            description="See who is hiring right now and the roles they have open."
          />
        </Reveal>

        {query.isLoading ? (
          <div className={GRID_CLASS}>
            {Array.from({ length: CARD_COUNT }, (_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
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
            <ul className={GRID_CLASS}>
              {cards.map((job) => (
                <li key={job.id}>
                  <HomeJobCard job={job} companyFirst />
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
