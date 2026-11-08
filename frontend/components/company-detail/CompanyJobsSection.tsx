'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Clock, MapPin, Search } from 'lucide-react';
import type { CompanyJobItem } from '@/types/company';

interface CompanyJobsSectionProps {
  jobs: CompanyJobItem[];
  companyName: string;
}

export default function CompanyJobsSection({ jobs, companyName }: CompanyJobsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchSearch;
  });

  return (
    <section id="section-jobs" className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7">
      <div className="border-outline-variant flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-on-surface text-lg font-bold sm:text-xl">Tin tuyển dụng đang mở</h2>
            <p className="text-on-surface-variant mt-0.5 text-xs">Cơ hội việc làm mới nhất từ {companyName}</p>
          </div>
        </div>

        <span className="bg-primary-container text-primary rounded-full px-3 py-1 text-xs font-bold">
          {jobs.length} vị trí đang tuyển
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-outline absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo chức danh, từ khóa kỹ năng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-primary focus:ring-primary border-outline-variant bg-surface-container-low/60 text-on-surface w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs placeholder-slate-400 transition focus:bg-white focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="text-on-surface-variant py-12 text-center">
            <Briefcase className="text-outline mx-auto mb-2 h-10 w-10" />
            <p className="text-sm font-semibold">Không tìm thấy vị trí tuyển dụng phù hợp với từ khóa này.</p>
            <p className="text-outline mt-1 text-xs">Vui lòng thử tìm kiếm bằng từ khóa khác.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group hover:border-primary/70 border-outline-variant/90 hover:shadow-elevation-1 rounded-xl border bg-white p-4.5 transition duration-200"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="group-hover:text-primary text-body-lg text-on-surface mt-1 font-bold transition-colors">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="text-on-surface-variant mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <span className="bg-primary-light text-primary rounded border border-emerald-100 px-2 py-0.5 font-extrabold">
                      {job.salary}
                    </span>

                    <span className="text-on-surface-variant flex items-center gap-1">
                      <MapPin className="text-outline h-3.5 w-3.5" />
                      <span>{job.location}</span>
                    </span>

                    <span className="text-on-surface-variant flex items-center gap-1">
                      <Clock className="text-outline h-3.5 w-3.5" />
                      <span>{job.deadline}</span>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="hover:bg-primary-hover bg-primary inline-flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition group-hover:shadow-sm"
                  >
                    <span>Ứng tuyển</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
