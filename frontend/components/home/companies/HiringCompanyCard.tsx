import CompanyLogo from '@/components/jobs/CompanyLogo';
import type { PublicJobCompany, PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MAX_ROLES = 3;

type HiringCompanyCardProps = {
  company: PublicJobCompany;
  jobs: PublicJobSummaryResource[];
  featured?: boolean;
};

export default function HiringCompanyCard({ company, jobs, featured }: HiringCompanyCardProps) {
  const hiddenRoles = Math.max(jobs.length - MAX_ROLES, 0);

  return (
    <article className="group bg-surface border-outline-variant ease-standard hover:border-primary hover:shadow-card relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <CompanyLogo name={company.name} src={company.logoUrl} className="h-14 w-14 rounded-xl" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/companies/${company.id}`}
            className="font-display text-title-md text-on-surface line-clamp-1 font-bold after:absolute after:inset-0 after:content-['']"
          >
            {company.name}
          </Link>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            {jobs.length > 0 ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}` : 'Featured employer'}
          </p>
        </div>
        {featured && (
          <span className="bg-primary-container text-on-primary-container self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold">
            Featured
          </span>
        )}
      </div>

      {jobs.length > 0 ? (
        <ul className="divide-outline-variant border-outline-variant mt-5 divide-y border-t">
          {jobs.slice(0, MAX_ROLES).map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="hover:text-primary relative z-10 flex items-center justify-between gap-4 py-3 transition-colors"
              >
                <span className="text-body-md truncate font-medium">{job.title}</span>
                <span className="text-label-lg text-primary shrink-0 font-semibold">{formatSalary(job.salary)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-md text-on-surface-variant border-outline-variant mt-5 border-t pt-4">
          Explore the company profile and the positions it is hiring for.
        </p>
      )}

      <p className="text-body-md text-primary mt-auto flex items-center justify-between pt-4 font-semibold">
        {hiddenRoles > 0 ? `+${hiddenRoles} more ${hiddenRoles === 1 ? 'role' : 'roles'}` : 'View company'}
        <ArrowUpRight
          className="ease-standard h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </p>
    </article>
  );
}
