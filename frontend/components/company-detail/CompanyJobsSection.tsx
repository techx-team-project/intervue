'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Search, MapPin, Clock, ArrowRight, Filter } from 'lucide-react';
import type { CompanyBranch, CompanyJobItem } from '@/types/company';

interface CompanyJobsSectionProps {
  jobs: CompanyJobItem[];
  companyName: string;
  branches?: CompanyBranch[];
}

export default function CompanyJobsSection({ jobs, companyName, branches }: CompanyJobsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Compute unique locations for filter
  const locationOptions = Array.from(
    new Set([...jobs.map((j) => j.location), ...(branches ? branches.map((b) => b.name) : [])]),
  );

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchLocation =
      selectedBranch === 'all' ||
      job.location.toLowerCase().includes(selectedBranch.toLowerCase()) ||
      selectedBranch.toLowerCase().includes(job.location.toLowerCase());

    return matchSearch && matchLocation;
  });

  return (
    <section id="section-jobs" className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#00b14f]">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Tin tuyển dụng đang mở</h2>
            <p className="mt-0.5 text-xs text-slate-500">Cơ hội việc làm mới nhất từ {companyName}</p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#00873c]">
          {filteredJobs.length} vị trí đang tuyển
        </span>
      </div>

      {/* Filter / Search Bar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo chức danh, từ khóa kỹ năng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-[#00b14f] focus:bg-white focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
          />
        </div>

        {/* Location Filter */}
        <div className="relative sm:w-64">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-8 pl-3.5 text-xs font-medium text-slate-700 transition-all focus:border-[#00b14f] focus:bg-white focus:outline-none"
          >
            <option value="all">Tất cả địa điểm</option>
            {locationOptions.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Jobs List */}
      <div className="mt-5 space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Briefcase className="mx-auto mb-2 h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold">Không tìm thấy vị trí tuyển dụng phù hợp với từ khóa này.</p>
            <p className="mt-1 text-xs text-slate-400">Vui lòng thử tìm kiếm bằng từ khóa khác.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00b14f]/70 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {job.isHot && (
                      <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-black text-red-600 uppercase">
                        HOT
                      </span>
                    )}
                    {job.isUrgent && (
                      <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        Tuyển gấp
                      </span>
                    )}
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="mt-1 text-[15px] font-bold text-slate-900 transition-colors group-hover:text-[#00b14f]">
                      {job.title}
                    </h3>
                  </Link>

                  {/* Badges metadata */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                    <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-extrabold text-[#00873c]">
                      {job.salary}
                    </span>

                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </span>

                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{job.deadline}</span>
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-linear-to-r from-[#00b14f] to-[#009643] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all group-hover:shadow-sm hover:bg-[#009643]"
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
