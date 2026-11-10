import { JOB_HIGHLIGHT_LABEL, JOB_HIGHLIGHT_STYLE } from '@/constants/job-highlight';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { jobFacts } from '@/utils/public-job';
import { formatSalary } from '@/utils/public-company';
import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';

const MAX_FACT_TAGS = 2;
const TAG_CLASS = 'bg-surface-container-low text-body-md text-on-surface rounded-full px-3 py-1';

interface PublicJobCardProps {
  job: PublicJobSummaryResource;
}

export default function PublicJobCard({ job }: PublicJobCardProps) {
  const facts = jobFacts(job).slice(0, MAX_FACT_TAGS);

  return (
    <article
      className={cn(
        'bg-surface hover:bg-primary-light hover:border-l-primary ease-standard hover:shadow-elevation-1 relative flex h-full flex-col justify-between gap-3 rounded-xl border-l-4 border-l-transparent p-4 transition-all duration-200 hover:-translate-y-0.5',
        job.highlighted && 'border-l-primary bg-emerald-50/60',
      )}
    >
      <div className="flex gap-4">
        <Link href={`/companies/${job.company.id}`} aria-label={job.company.name} className="shrink-0">
          <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-20 w-20 rounded-lg" />
        </Link>

        <div className="min-w-0 flex-1 space-y-1 pr-8">
          <h3 className="text-title-md text-on-surface line-clamp-2 font-bold">
            {job.highlightLabel && (
              <span
                className={cn(
                  'mr-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[11px] font-extrabold',
                  JOB_HIGHLIGHT_STYLE[job.highlightLabel],
                )}
              >
                {JOB_HIGHLIGHT_LABEL[job.highlightLabel]}
              </span>
            )}
            <Link href={`/jobs/${job.id}`} className="hover:text-primary">
              {job.title}
            </Link>
          </h3>
          <Link
            href={`/companies/${job.company.id}`}
            className="text-body-md text-on-surface-variant block truncate uppercase hover:underline"
          >
            {job.company.name}
          </Link>
        </div>
      </div>

      <SaveJobButton jobId={job.id} className="absolute top-3 right-3" />

      <div className="flex flex-wrap gap-2">
        <span className={TAG_CLASS}>{formatSalary(job.salary)}</span>
        {facts.map((fact) => (
          <span key={fact} className={TAG_CLASS}>
            {fact}
          </span>
        ))}
      </div>
    </article>
  );
}
