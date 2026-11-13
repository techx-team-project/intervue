'use client';

import JobHighlightBadge from '@/components/jobs/JobHighlightBadge';
import { useHasApplied } from '@/hooks/useCandidateApplication';
import { CLOSING_SOON_DAYS, NEW_JOB_DAYS } from '@/constants/job-filters';
import { cn } from '@/lib/utils';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { dayDifferenceFromToday, formatRelativeDay } from '@/utils/datetime';
import { daysLeft, deadlineLabel, jobFacts } from '@/utils/public-job';

export function AppliedBadge({ jobId }: { jobId: number }) {
  if (!useHasApplied(jobId)) return null;
  return (
    <span className="bg-surface-container-high text-on-surface-variant mr-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[11px] font-extrabold">
      APPLIED
    </span>
  );
}

export function JobStatusBadges({ job }: { job: PublicJobSummaryResource }) {
  const isNew = job.publishedAt !== undefined && Math.abs(dayDifferenceFromToday(job.publishedAt)) <= NEW_JOB_DAYS;
  if (!job.highlightLabel && !isNew) return null;

  return (
    <>
      {job.highlightLabel && <JobHighlightBadge label={job.highlightLabel} />}
      {isNew && (
        <span className="bg-primary-container text-on-primary-container mr-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[11px] font-extrabold">
          NEW
        </span>
      )}
    </>
  );
}

type JobFactChipsProps = {
  job: Pick<PublicJobSummaryResource, 'city' | 'level' | 'workingArrangement' | 'contractType'>;
};

export function JobFactChips({ job }: JobFactChipsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {jobFacts(job).map((fact) => (
        <li
          key={fact}
          className="bg-surface-container-low text-label-lg text-on-surface-variant rounded-full px-3 py-1"
        >
          {fact}
        </li>
      ))}
    </ul>
  );
}

type JobSkillTagsProps = {
  skills: PublicJobSummaryResource['skills'];
  matchedSkillIds?: Set<number>;
  max: number;
};

export function JobSkillTags({ skills, matchedSkillIds, max }: JobSkillTagsProps) {
  if (skills.length === 0) return null;
  const ordered = [...skills].sort(
    (first, second) => Number(matchedSkillIds?.has(second.id)) - Number(matchedSkillIds?.has(first.id)),
  );
  const hidden = Math.max(ordered.length - max, 0);

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Required skills">
      {ordered.slice(0, max).map((skill) => (
        <li
          key={skill.id}
          className={cn(
            'text-label-md rounded-md border px-2 py-0.5 font-medium',
            matchedSkillIds?.has(skill.id)
              ? 'border-primary/40 bg-primary-light text-primary'
              : 'border-outline-variant text-on-surface-variant',
          )}
        >
          {skill.name}
        </li>
      ))}
      {hidden > 0 && <li className="text-label-md text-on-surface-variant px-1 py-0.5">+{hidden}</li>}
    </ul>
  );
}

type JobTimingProps = {
  job: Pick<PublicJobSummaryResource, 'deadline' | 'publishedAt'>;
  className?: string;
};

export function JobTiming({ job, className }: JobTimingProps) {
  const left = daysLeft(job.deadline);

  return (
    <div className={cn('text-label-md text-on-surface-variant', className)}>
      {left !== null && (
        <p className={cn(left <= CLOSING_SOON_DAYS && 'text-error font-semibold')}>{deadlineLabel(job.deadline)}</p>
      )}
      {job.publishedAt && <p>Posted {formatRelativeDay(job.publishedAt).toLowerCase()}</p>}
    </div>
  );
}
