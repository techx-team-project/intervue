import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import JobHighlightBadge from '@/components/jobs/JobHighlightBadge';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { jobFacts } from '@/utils/public-job';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MAX_FACT_TAGS = 3;

type FeaturedJobCardProps = {
  job: PublicJobSummaryResource;
};

export default function FeaturedJobCard({ job }: FeaturedJobCardProps) {
  const facts = jobFacts(job).slice(0, MAX_FACT_TAGS);

  return (
    <article
      className={cn(
        'group bg-surface border-outline-variant ease-standard hover:border-primary hover:shadow-card relative flex h-full flex-col gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5',
        job.highlighted && 'border-primary/40 bg-primary-light',
      )}
    >
      <div className="flex items-center gap-3 pr-10">
        <Link href={`/companies/${job.company.id}`} aria-label={job.company.name} className="relative z-10 shrink-0">
          <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-11 w-11 rounded-lg" />
        </Link>
        <Link
          href={`/companies/${job.company.id}`}
          className="text-label-md text-on-surface-variant hover:text-primary relative z-10 truncate font-semibold tracking-wider uppercase transition-colors"
        >
          {job.company.name}
        </Link>
      </div>

      <SaveJobButton jobId={job.id} className="absolute top-4 right-4 z-10" />

      <h3 className="font-display text-title-md text-on-surface line-clamp-2 min-h-12 font-bold">
        {job.highlightLabel && <JobHighlightBadge label={job.highlightLabel} />}
        <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-['']">
          {job.title}
        </Link>
      </h3>

      <ul className="flex flex-wrap gap-2">
        {facts.map((fact) => (
          <li
            key={fact}
            className="bg-surface-container-low text-label-lg text-on-surface-variant rounded-full px-3 py-1"
          >
            {fact}
          </li>
        ))}
      </ul>

      <div className="border-outline-variant mt-auto flex items-center justify-between border-t pt-4">
        <p className="font-display text-title-md text-primary font-bold">{formatSalary(job.salary)}</p>
        <span className="border-outline-variant text-outline ease-standard group-hover:bg-primary group-hover:border-primary flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}
