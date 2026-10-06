'use client';

import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import type { RelatedJob } from '@/types/job';

interface JobRelatedSectionProps {
  relatedJobs: RelatedJob[];
}

export default function JobRelatedSection({ relatedJobs }: JobRelatedSectionProps) {
  return (
    <section id="job-related" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#00b14f]">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Việc làm liên quan</h2>
            <p className="mt-0.5 text-xs text-slate-500">Các vị trí tuyển dụng tương tự có thể bạn quan tâm</p>
          </div>
        </div>

        <Link
          href="/#feature-jobs"
          className="flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {relatedJobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="group block rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#00b14f]/60 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1 group-hover:border-emerald-200">
                <Building2 className="h-6 w-6 text-slate-400 group-hover:text-[#00b14f]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="line-clamp-2 text-sm font-bold text-slate-800 transition-colors group-hover:text-[#00b14f]"
                  title={job.title}
                >
                  {job.title}
                </h3>
                <div className="mt-1 truncate text-xs text-slate-500">{job.company}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {job.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-extrabold text-[#00873c]">
                {job.salary}
              </span>

              <div className="flex items-center gap-3 text-slate-500">
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
