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

/** Checks if a job has high salary (>= 20 million VND or equivalent) */
function isHighSalaryJob(salary: string): boolean {
  if (!salary || salary === 'Thoả thuận') return false;

  // Extract digits representing millions (e.g., '15 - 30 triệu', 'Tới 20 triệu', '25 - 40 Tr')
  const match = salary.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:triệu|tr)/i);
  if (match) {
    const maxVal = match[2] ? parseInt(match[2], 10) : parseInt(match[1], 10);
    return maxVal >= 20;
  }

  // Check USD if any ($1,000+)
  const usdMatch = salary.match(/\$?\s*([\d,.]+)/);
  if (salary.includes('$') && usdMatch) {
    return parseFloat(usdMatch[1].replace(',', '')) >= 1000;
  }

  return false;
}

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
    if (activeFilter === 'high_salary') return isHighSalaryJob(job.salary);
    return true;
  });

  return (
    <section id="feature-jobs" className="container-topcv my-10">
      {/* 1. Box Header: Title, Job Type Switcher, View All & Arrows */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* Title & Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase sm:text-3xl">
            Việc làm <span className="text-primary">nổi bật</span>
          </h2>

          {/* 2 nút lọc dạng viên thuốc độc lập */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setJobType('office')}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm font-extrabold transition-all duration-200 active:scale-95 ${
                jobType === 'office'
                  ? 'bg-primary text-white shadow-xs hover:bg-emerald-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Việc văn phòng
            </button>
            <button
              type="button"
              onClick={() => setJobType('general_labor')}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm font-extrabold transition-all duration-200 active:scale-95 ${
                jobType === 'general_labor'
                  ? 'bg-primary text-white shadow-xs hover:bg-emerald-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Việc phổ thông
            </button>
          </div>
        </div>

        {/* Nút Xem tất cả */}
        <div className="flex items-center">
          <a
            href="https://www.topcv.vn/viec-lam-tot-nhat"
            target="_blank"
            rel="noreferrer"
            className="group bg-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-4.5 py-2 text-sm font-extrabold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 sm:px-5 sm:py-2.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* 2. Sub Filter Buttons Bar */}
      <div className="mb-4 flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
          <Filter className="text-primary h-3.5 w-3.5" />
          Lọc theo:
        </span>
        {LOCATION_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveFilter(item.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs transition-all ${
              activeFilter === item.id
                ? 'bg-primary font-bold text-white shadow-xs'
                : 'hover:text-primary border border-slate-200 bg-white font-medium text-slate-600 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. Quick Guide Tip Banner */}
      {showTip && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-xs text-emerald-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
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
            className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
            title="Đóng gợi ý"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4. Beautiful & Professional Job Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} isSaved={savedJobs.includes(job.id)} onToggleSave={toggleSaveJob} />
        ))}
      </div>
    </section>
  );
}
