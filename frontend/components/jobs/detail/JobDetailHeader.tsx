import CompanyLogo from '@/components/jobs/CompanyLogo';
import JobHighlightBadge from '@/components/jobs/JobHighlightBadge';
import { JobFactChips } from '@/components/jobs/listing/JobCardParts';
import { CLOSING_SOON_DAYS } from '@/constants/job-filters';
import { cn } from '@/lib/utils';
import type { PublicJobResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { daysLeft, deadlineLabel } from '@/utils/public-job';
import Link from 'next/link';

type JobDetailHeaderProps = {
  job: PublicJobResource;
};

type Stat = { label: string; value: string; accent?: boolean; urgent?: boolean };

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const left = daysLeft(job.deadline);
  const stats: Stat[] = [
    { label: 'Salary', value: formatSalary(job.salary), accent: true },
    ...(job.deadline
      ? [{ label: 'Deadline', value: deadlineLabel(job.deadline), urgent: left !== null && left <= CLOSING_SOON_DAYS }]
      : []),
    { label: job.openings === 1 ? 'Opening' : 'Openings', value: String(job.openings) },
  ];

  return (
    <header className="bg-surface border-outline-variant rounded-2xl border">
      <div className="flex gap-5 p-6 sm:p-8">
        <Link href={`/companies/${job.company.id}`} aria-label={job.company.name} className="shrink-0">
          <CompanyLogo
            name={job.company.name}
            src={job.company.logoUrl}
            className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20"
          />
        </Link>
        <div className="min-w-0 flex-1 space-y-3">
          <Link
            href={`/companies/${job.company.id}`}
            className="text-label-lg text-on-surface-variant hover:text-primary block truncate font-semibold tracking-wider uppercase transition-colors"
          >
            {job.company.name}
          </Link>
          <h1 id="job-title" className="font-display text-headline-sm sm:text-headline-md text-on-surface font-bold">
            {job.highlightLabel && <JobHighlightBadge label={job.highlightLabel} />}
            {job.title}
          </h1>
          <JobFactChips
            job={{
              city: job.location.city,
              level: job.level,
              workingArrangement: job.workingArrangement,
              contractType: job.contractType,
            }}
          />
        </div>
      </div>

      <dl className="border-outline-variant divide-outline-variant grid grid-cols-3 divide-x border-t">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 sm:px-8">
            <dt className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
              {stat.label}
            </dt>
            <dd
              className={cn(
                'font-display mt-1 text-lg font-bold sm:text-xl',
                stat.accent && 'text-primary',
                stat.urgent && 'text-error',
                !stat.accent && !stat.urgent && 'text-on-surface',
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
