import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import JobHighlightBadge from '@/components/jobs/JobHighlightBadge';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { daysLeft, deadlineLabel, jobFacts } from '@/utils/public-job';
import { Clock, MapPin, Wallet } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const MAX_FACT_BADGES = 2;
const URGENT_DAYS = 7;
const BADGE_CLASS = 'text-label-md inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold';

type HomeJobCardProps = {
  job: PublicJobSummaryResource;
  companyFirst?: boolean;
  children?: ReactNode;
};

export default function HomeJobCard({ job, companyFirst, children }: HomeJobCardProps) {
  const [city, ...otherFacts] = jobFacts(job);
  const left = daysLeft(job.deadline);
  const title = (
    <h3 className="font-display text-body-lg text-on-surface group-hover:text-primary truncate font-bold transition-colors">
      {job.highlightLabel && <JobHighlightBadge label={job.highlightLabel} />}
      <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-['']">
        {job.title}
      </Link>
    </h3>
  );
  const company = (
    <Link
      href={`/companies/${job.company.id}`}
      className={cn(
        'hover:text-primary relative z-10 block truncate transition-colors',
        companyFirst ? 'font-display text-body-lg text-on-surface font-bold' : 'text-body-md text-on-surface-variant',
      )}
    >
      {job.company.name}
    </Link>
  );

  return (
    <article
      className={cn(
        'group bg-surface border-outline-variant ease-standard hover:border-primary relative flex h-full flex-col gap-3 rounded-xl border p-4 transition-colors duration-150',
        job.highlighted && 'border-primary/40 bg-primary-light',
      )}
    >
      <div className="flex items-center gap-3 pr-8">
        <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-10 w-10 rounded-lg" />
        <div className="min-w-0 flex-1">
          {companyFirst ? company : title}
          {companyFirst ? (
            <p className="text-body-md text-on-surface-variant group-hover:text-primary truncate transition-colors">
              {job.highlightLabel && <JobHighlightBadge label={job.highlightLabel} />}
              <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-['']">
                {job.title}
              </Link>
            </p>
          ) : (
            company
          )}
        </div>
      </div>

      <SaveJobButton jobId={job.id} className="absolute top-3 right-3 z-10" />

      {children}

      <ul className="mt-auto flex flex-wrap gap-1.5">
        <li className={cn(BADGE_CLASS, 'bg-primary-container text-on-primary-container')}>
          <Wallet className="h-3.5 w-3.5" aria-hidden />
          {formatSalary(job.salary)}
        </li>
        {city && (
          <li className={cn(BADGE_CLASS, 'bg-surface-container-high text-on-surface')}>
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {city}
          </li>
        )}
        {otherFacts.slice(0, MAX_FACT_BADGES).map((fact) => (
          <li key={fact} className={cn(BADGE_CLASS, 'bg-surface-container-low text-on-surface-variant')}>
            {fact}
          </li>
        ))}
        {left !== null && left <= URGENT_DAYS && (
          <li className={cn(BADGE_CLASS, 'bg-error/10 text-error')}>
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {deadlineLabel(job.deadline)}
          </li>
        )}
      </ul>
    </article>
  );
}
