'use client';

import { useState } from 'react';
import { ArrowRight, Filter, Lightbulb, X } from 'lucide-react';

import { FEATURED_JOBS } from '@/mocks/home/jobs.mock';

import JobCard from './JobCard';

const LOCATION_FILTERS = [
  { id: 'all', label: 'Ngẫu nhiên' },
  { id: 'hanoi', label: 'Hà Nội' },
  { id: 'hcm', label: 'TP. Hồ Chí Minh' },
  { id: 'danang', label: 'Đà Nẵng' },
  { id: 'high_salary', label: 'Lương cao' },
];

export default function FeaturedJobsSection() {
  const [jobType, setJobType] = useState<'office' | 'general_labor'>('office');
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [showTip, setShowTip] = useState(true);

  const toggleSaveJob = (id: number) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]));
  };

  const filteredJobs = FEATURED_JOBS.filter((job) => {
    if (job.type !== jobType) return false;
    if (activeFilter === 'hanoi') return job.location.includes('Hà Nội');
    if (activeFilter === 'hcm') return job.location.includes('Hồ Chí Minh') || job.location.includes('TP. HCM');
    if (activeFilter === 'danang') return job.location.includes('Đà Nẵng');
    if (activeFilter === 'high_salary')
      return (
        job.salary.includes('28') || job.salary.includes('35') || job.salary.includes('50') || job.salary.includes('40')
      );
    return true;
  });

  return (
    <section id="feature-jobs" className="container-topcv my-10">
      {/* 1. Box Header: Title, Job Type Switcher, View All & Arrows (Giữ nguyên bố cục gốc TopCV) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* Title & Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-[22px] font-black tracking-tight text-[#1e293b] uppercase sm:text-[25px] md:text-[28px]">
            Việc làm <span className="text-[#00b14f]">nổi bật</span>
          </h2>

          {/* 2 nút lọc dạng viên thuốc độc lập (không đưa vào khung) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setJobType('office')}
              className={`cursor-pointer rounded-full px-5 py-2 text-[13.5px] font-extrabold transition-all duration-200 active:scale-95 ${
                jobType === 'office'
                  ? 'bg-[#00b14f] text-white shadow-sm shadow-[#00b14f]/30 hover:bg-[#00c957]'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#1e293b]'
              }`}
            >
              Việc văn phòng
            </button>
            <button
              type="button"
              onClick={() => setJobType('general_labor')}
              className={`cursor-pointer rounded-full px-5 py-2 text-[13.5px] font-extrabold transition-all duration-200 active:scale-95 ${
                jobType === 'general_labor'
                  ? 'bg-[#00b14f] text-white shadow-sm shadow-[#00b14f]/30 hover:bg-[#00c957]'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#1e293b]'
              }`}
            >
              Việc phổ thông
            </button>
          </div>
        </div>

        {/* Nút Xem tất cả màu xanh neon cứng cáp, nổi bật */}
        <div className="flex items-center">
          <a
            href="https://www.topcv.vn/viec-lam-tot-nhat"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#00b14f] px-4.5 py-2 text-[13.5px] font-extrabold text-white shadow-sm shadow-[#00b14f]/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00c957] hover:shadow-md hover:shadow-[#00b14f]/40 active:translate-y-0 active:scale-95 sm:px-5 sm:py-2.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* 2. Sub Filter Buttons Bar (Giữ nguyên bố cục thanh lọc gốc) */}
      <div className="mb-4 flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-[#64748b]">
          <Filter className="h-3.5 w-3.5 text-[#00b14f]" />
          Lọc theo:
        </span>
        {LOCATION_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveFilter(item.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-[13px] transition-all ${
              activeFilter === item.id
                ? 'bg-[#00b14f] font-bold text-white shadow-sm shadow-[#00b14f]/25'
                : 'border border-[#e2e8f0] bg-white font-medium text-[#475569] shadow-2xs hover:border-[#00b14f]/50 hover:bg-[#f0fdf4] hover:text-[#00b14f]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. Quick Guide Tip Banner (Giữ nguyên banner gợi ý gốc) */}
      {showTip && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-[#a7f3d0] bg-linear-to-r from-[#ecfdf5] via-[#f0fdf4] to-[#f8fafc] px-4 py-2.5 text-[13px] text-[#047857] shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00b14f]/15 text-[#00b14f]">
              <Lightbulb className="h-3.5 w-3.5" />
            </div>
            <span>
              <strong>Gợi ý:</strong> Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết và cơ hội ứng tuyển
              nhanh
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTip(false)}
            className="cursor-pointer rounded-md p-1 text-[#94a3b8] transition-colors hover:text-[#475569]"
            title="Đóng gợi ý"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4. Beautiful, WOW & Professional Job Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} isSaved={savedJobs.includes(job.id)} onToggleSave={toggleSaveJob} />
        ))}
      </div>
    </section>
  );
}
