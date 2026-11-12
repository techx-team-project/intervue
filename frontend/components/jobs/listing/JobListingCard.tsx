import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import Link from 'next/link';
import { JobFactChips, JobSkillTags, JobStatusBadges, JobTiming } from './JobCardParts';

const MAX_SKILLS = 6;

type JobListingCardProps = {
  job: PublicJobSummaryResource;
  matchedSkillIds?: Set<number>;
  onQuickView: (job: PublicJobSummaryResource) => void;
};

export default function JobListingCard({ job, matchedSkillIds, onQuickView }: JobListingCardProps) {
  return (
    <article
      className={cn(
        'group bg-surface border-outline-variant ease-standard hover:border-primary hover:shadow-card relative flex gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5',
        job.highlighted && 'border-primary/40 bg-primary-light',
      )}
    >
      <Link
        href={`/companies/${job.company.id}`}
        aria-label={job.company.name}
        className="relative z-10 shrink-0 self-start"
      >
        <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-12 w-12 rounded-lg" />
      </Link>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-1 pr-10">
          <Link
            href={`/companies/${job.company.id}`}
            className="text-label-md text-on-surface-variant hover:text-primary relative z-10 block truncate font-semibold tracking-wider uppercase transition-colors"
          >
            {job.company.name}
          </Link>
          <h3 className="font-display text-title-md text-on-surface line-clamp-2 font-bold">
            <JobStatusBadges job={job} />
            <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-['']">
              {job.title}
            </Link>
          </h3>
        </div>

        <JobFactChips job={job} />
        <JobSkillTags skills={job.skills} matchedSkillIds={matchedSkillIds} max={MAX_SKILLS} />

        <div className="flex items-end justify-between gap-3 sm:hidden">
          <p className="font-display text-title-md text-primary font-bold">{formatSalary(job.salary)}</p>
          <JobTiming job={job} className="text-right" />
        </div>
      </div>

      <div className="hidden w-44 shrink-0 flex-col items-end gap-1 pt-9 text-right sm:flex">
        <p className="font-display text-title-md text-primary font-bold">{formatSalary(job.salary)}</p>
        <JobTiming job={job} />
        <button
          type="button"
          onClick={() => onQuickView(job)}
          className="text-label-lg text-on-surface-variant hover:text-primary relative z-10 mt-auto cursor-pointer font-semibold transition-colors hover:underline"
        >
          Quick view
        </button>
      </div>

      <SaveJobButton jobId={job.id} className="absolute top-4 right-4 z-10" />
    </article>
  );
}
