'use client';

import { buttonClassName } from '@/components/ui/Button';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { cn } from '@/lib/utils';
import { formatSalary } from '@/utils/public-company';
import { jobFacts } from '@/utils/public-job';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DECK_SIZE = 5;
const AUTOPLAY_INTERVAL_MS = 4500;
const POSITION_CLASSES = [
  'z-30 translate-y-0 scale-100 duration-700',
  'z-20 translate-y-6 scale-[0.95] brightness-95 duration-700',
  'z-10 translate-y-12 scale-[0.9] brightness-90 duration-700',
];
const LEAVING_CLASS = 'pointer-events-none z-40 -translate-y-10 scale-105 opacity-0 duration-300';
const HIDDEN_CLASS = 'pointer-events-none z-0 translate-y-16 scale-[0.85] opacity-0 duration-700';

export default function JobDeck() {
  const query = usePublicJobs({ size: DECK_SIZE });
  const jobs = query.data?.items ?? [];
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (jobs.length < 2 || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % jobs.length), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [jobs.length, isPaused]);

  if (query.isLoading) return <Skeleton className="h-[390px] w-full rounded-3xl bg-white/10" />;

  if (query.isError || jobs.length === 0) {
    return (
      <p className="text-body-lg rounded-3xl border border-white/15 p-10 text-center text-white/70">
        {query.isError ? 'Could not load jobs.' : 'No new job posts yet.'}
      </p>
    );
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Newly posted jobs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative h-[390px]">
        {jobs.map((job, jobIndex) => {
          const position = (jobIndex - index + jobs.length) % jobs.length;
          const isTop = position === 0;
          const isLeaving = jobs.length > 3 && position === jobs.length - 1;
          const facts = jobFacts(job).slice(0, 3);

          return (
            <article
              key={job.id}
              aria-hidden={!isTop}
              className={cn(
                'shadow-float ease-standard absolute inset-x-0 top-0 flex h-[330px] flex-col rounded-3xl bg-white p-7 transition-all',
                isLeaving ? LEAVING_CLASS : (POSITION_CLASSES[position] ?? HIDDEN_CLASS),
              )}
            >
              <div className="flex items-center gap-3">
                <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-12 w-12 rounded-xl" />
                <p className="text-body-sm text-on-surface-variant line-clamp-1 flex-1 uppercase">{job.company.name}</p>
                <span className="bg-primary-container text-on-primary-container text-label-md shrink-0 rounded-full px-3 py-1 font-semibold">
                  New
                </span>
              </div>

              <h3 className="font-display text-headline-sm text-on-surface mt-5 line-clamp-2 font-bold">{job.title}</h3>

              <ul className="mt-4 flex flex-wrap gap-2">
                {facts.map((fact) => (
                  <li
                    key={fact}
                    className="bg-surface-container-low text-label-lg text-on-surface rounded-full px-3 py-1.5"
                  >
                    {fact}
                  </li>
                ))}
              </ul>

              <div className="border-outline-variant mt-auto flex items-end justify-between border-t pt-5">
                <div>
                  <p className="text-label-md text-on-surface-variant">Salary</p>
                  <p className="font-display text-headline-sm text-primary font-bold">{formatSalary(job.salary)}</p>
                </div>
                <Link href={`/jobs/${job.id}`} tabIndex={isTop ? 0 : -1} className={buttonClassName({ size: 'xl' })}>
                  View details
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {jobs.map((job, jobIndex) => (
          <button
            key={job.id}
            type="button"
            aria-label={`View job ${jobIndex + 1}`}
            aria-current={jobIndex === index}
            onClick={() => setIndex(jobIndex)}
            className={cn(
              'ease-standard h-1.5 cursor-pointer rounded-full transition-all duration-300',
              jobIndex === index ? 'bg-primary-bright w-8' : 'w-3 bg-white/30',
            )}
          />
        ))}
      </div>
    </div>
  );
}
