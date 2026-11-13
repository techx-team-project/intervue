'use client';

import { ROUTES } from '@/constants/routes';
import { useJobQuota } from '@/hooks/useRecruiterJobs';
import { cn } from '@/lib/utils';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useWatch } from 'react-hook-form';

const MIN_DESCRIPTION_LENGTH = 50;
const MIN_REQUIREMENTS_LENGTH = 20;

function checklistOf(values: JobPostFormData): Array<{ label: string; done: boolean }> {
  const hasSalary = values.salaryNegotiable || (values.salaryMin !== undefined && values.salaryMax !== undefined);
  return [
    { label: 'Title', done: values.title.trim().length >= 5 },
    { label: 'Job role', done: values.jobRole !== undefined },
    { label: 'Location', done: values.city.trim().length > 0 },
    { label: 'Salary', done: hasSalary },
    { label: 'Skills', done: values.skills.length > 0 },
    { label: 'Job description', done: values.description.trim().length >= MIN_DESCRIPTION_LENGTH },
    { label: 'Candidate requirements', done: values.requirements.trim().length >= MIN_REQUIREMENTS_LENGTH },
    { label: 'Application deadline', done: values.deadline.length > 0 },
  ];
}

export default function JobFormSidebar() {
  const values = useWatch() as JobPostFormData;
  const items = checklistOf(values);
  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);
  const { data: quota } = useJobQuota();
  const outOfSlots = quota !== undefined && quota.slotRequired && quota.slotsRemaining === 0;
  const freeLimitReached =
    quota !== undefined && !quota.slotRequired && quota.slotsRemaining === 0 && quota.freePostsUsed >= quota.freeLimit;

  return (
    <aside
      className="border-outline-variant rounded-xl border bg-white p-5 lg:sticky lg:top-24"
      aria-label="Completion progress"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-navy text-body-md font-bold">Completion progress</h3>
        <span className="text-body-sm text-on-surface-variant tabular-nums">
          {doneCount}/{items.length}
        </span>
      </div>
      <div
        className="bg-surface-container-high mt-3 h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                item.done ? 'bg-primary border-primary text-white' : 'border-outline bg-white',
              )}
              aria-hidden
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={cn('text-body-sm', item.done ? 'text-on-surface' : 'text-on-surface-variant')}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {quota && (
        <div className="border-outline-variant mt-4 border-t pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-body-sm text-on-surface-variant">
              {quota.slotRequired ? 'Remaining job posts' : 'Free posts used'}
            </span>
            <span className="text-navy text-body-md font-bold tabular-nums">
              {quota.slotRequired ? quota.slotsRemaining : `${quota.freePostsUsed} / ${quota.freeLimit}`}
            </span>
          </div>
          {!quota.slotRequired && (
            <p className="text-body-sm text-on-surface-variant mt-1">
              Free posts can run up to {quota.freeMaxDays} days.
            </p>
          )}
          {freeLimitReached && (
            <p className="text-body-sm mt-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
              You have used all your free posts.{' '}
              <Link href={ROUTES.RECRUITER_SERVICES} className="font-semibold underline">
                Buy a package
              </Link>{' '}
              to post more jobs.
            </p>
          )}
          {outOfSlots && (
            <p className="text-body-sm mt-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
              You have no posts left.{' '}
              <Link href={ROUTES.RECRUITER_SERVICES} className="font-semibold underline">
                Buy more services
              </Link>
              .
            </p>
          )}
        </div>
      )}

      <p className="text-body-sm text-on-surface-variant border-outline-variant mt-4 border-t pt-4 leading-relaxed">
        Complete the items above to publish. You can still save a draft at any time.
      </p>
    </aside>
  );
}
