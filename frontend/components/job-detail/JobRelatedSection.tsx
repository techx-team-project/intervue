'use client';

import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import type { RelatedJob } from '@/types/job';

interface JobRelatedSectionProps {
  relatedJobs: RelatedJob[];
}

export default function JobRelatedSection({ relatedJobs }: JobRelatedSectionProps) {
  return (
    <section id="job-related" className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7">
      <div className="border-outline-variant flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-on-surface text-lg font-bold sm:text-xl">Related jobs</h2>
            <p className="text-on-surface-variant mt-0.5 text-xs">Similar openings you may be interested in</p>
          </div>
        </div>

        <Link href="/#feature-jobs" className="text-primary flex items-center gap-1 text-xs font-bold hover:underline">
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {relatedJobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="group hover:border-primary/60 border-outline-variant/80 hover:shadow-elevation-1 block rounded-xl border bg-white p-4 transition duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="border-outline-variant bg-surface-container-low group-hover:border-primary/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-1">
                <Building2 className="group-hover:text-primary text-outline h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="group-hover:text-primary text-on-surface line-clamp-2 text-sm font-bold transition-colors"
                  title={job.title}
                >
                  {job.title}
                </h3>
                <div className="text-on-surface-variant mt-1 truncate text-xs">{job.company}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {job.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-outline-variant mt-3 flex items-center justify-between border-t pt-3 text-xs">
              <span className="bg-primary-light text-primary rounded border border-emerald-100 px-2 py-0.5 font-extrabold">
                {job.salary}
              </span>

              <div className="text-on-surface-variant flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.deadline}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
