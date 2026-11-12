'use client';

import CompanyLogo from '@/components/jobs/CompanyLogo';
import { buttonClassName } from '@/components/ui/Button';
import Sheet from '@/components/ui/Sheet';
import Skeleton from '@/components/ui/Skeleton';
import { usePublicJob } from '@/hooks/usePublicJob';
import type { PublicJobResource, PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { textLines } from '@/utils/public-job';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { JobFactChips, JobSkillTags, JobTiming } from './JobCardParts';

const MAX_SKILLS = 20;

type JobQuickViewProps = {
  job: PublicJobSummaryResource | null;
  matchedSkillIds?: Set<number>;
  onClose: () => void;
};

function TextSection({ title, text }: { title: string; text?: string }) {
  const lines = textLines(text);
  if (lines.length === 0) return null;

  return (
    <section>
      <h3 className="font-display text-title-md text-on-surface font-bold">{title}</h3>
      <ul className="text-body-md text-on-surface-variant mt-3 space-y-2">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2.5">
            <span aria-hidden className="bg-outline mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Highlights({ detail }: { detail: PublicJobResource }) {
  const items = [
    { label: detail.openings === 1 ? 'Opening' : 'Openings', value: String(detail.openings) },
    { label: 'Screening questions', value: String(detail.screening.questionCount) },
    {
      label: 'Time to apply',
      value: detail.screening.estimatedMinutes > 0 ? `${detail.screening.estimatedMinutes} min` : 'Quick',
    },
  ];

  return (
    <dl className="border-outline-variant divide-outline-variant grid grid-cols-3 divide-x rounded-2xl border">
      {items.map((item) => (
        <div key={item.label} className="px-4 py-3">
          <dd className="font-display text-title-md text-on-surface font-bold">{item.value}</dd>
          <dt className="text-label-md text-on-surface-variant">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export default function JobQuickView({ job, matchedSkillIds, onClose }: JobQuickViewProps) {
  const detail = usePublicJob(job?.id ?? null);

  return (
    <Sheet
      isOpen={job !== null}
      onClose={onClose}
      placement="right"
      ariaLabel="Job quick view"
      title={job?.title}
      footer={
        job && (
          <>
            <Link href={`/jobs/${job.id}`} className={buttonClassName({ variant: 'outline', className: 'flex-1' })}>
              Full details
            </Link>
            <Link href={`/jobs/${job.id}`} className={buttonClassName({ className: 'flex-1' })}>
              Apply now
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        )
      }
    >
      {job && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-14 w-14 rounded-xl" />
            <div className="min-w-0">
              <Link
                href={`/companies/${job.company.id}`}
                className="text-body-lg text-on-surface hover:text-primary font-semibold transition-colors"
              >
                {job.company.name}
              </Link>
              <p className="font-display text-title-lg text-primary font-bold">{formatSalary(job.salary)}</p>
            </div>
          </div>

          <JobFactChips job={detail.data ? { ...job, city: detail.data.location.city ?? job.city } : job} />
          <JobTiming job={job} />
          <JobSkillTags skills={detail.data?.skills ?? job.skills} matchedSkillIds={matchedSkillIds} max={MAX_SKILLS} />

          {detail.isLoading && (
            <div className="space-y-3" aria-busy>
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
          {detail.isError && (
            <p className="text-body-md text-on-surface-variant">
              Could not load the full description. Open the full details page to read it.
            </p>
          )}
          {detail.data && (
            <>
              <Highlights detail={detail.data} />
              <TextSection title="Job description" text={detail.data.description} />
              <TextSection title="Requirements" text={detail.data.requirements} />
              <TextSection title="Benefits" text={detail.data.benefits} />
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}
