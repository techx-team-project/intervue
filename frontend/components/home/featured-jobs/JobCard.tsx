import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Heart, MapPin, Zap } from 'lucide-react';

import type { Job } from '@/types/home';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

function JobLogo({ job }: { job: Job }) {
  if (job.id === 2320413) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#00b14f] to-[#047857] p-1 text-white shadow-xs">
        <span className="text-[13px] leading-none font-black tracking-wider drop-shadow-xs">ADI</span>
        <span className="mt-0.5 text-[6.5px] leading-none font-bold tracking-tighter text-emerald-100 uppercase">
          AUTOMATION
        </span>
      </div>
    );
  }
  if (job.id === 1) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-linear-to-br from-[#00b14f] to-[#047857] shadow-xs">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-2 text-white">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (job.id === 2) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xs">
        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-none stroke-current stroke-[2.5] text-[#002f6c]">
          <circle cx="16" cy="16" r="12" />
          <circle cx="16" cy="16" r="7" strokeDasharray="4 2" />
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        </svg>
        <span className="mt-1 text-[7.5px] leading-none font-black tracking-tighter text-[#0f172a] uppercase">
          CONCENTRIX
        </span>
      </div>
    );
  }
  if (job.id === 3) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#fbbf24] to-[#d97706] p-1 text-slate-900 shadow-xs">
        <span className="text-[14px] leading-none font-black tracking-tighter drop-shadow-xs">B</span>
        <span className="text-[8px] leading-none font-extrabold tracking-wider">BEE</span>
      </div>
    );
  }
  if (job.id === 4) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#002d72] p-1 text-white shadow-xs">
        <div className="flex items-center gap-0.5">
          <span className="text-[13px] leading-none font-black tracking-wider">MB</span>
          <span className="text-[10px] leading-none text-red-500">★</span>
        </div>
        <span className="mt-0.5 text-[6.5px] leading-none font-bold tracking-tighter text-blue-200">BANK</span>
      </div>
    );
  }
  if (job.id === 5) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xs">
        <div className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#f97316]"></span>
          <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
          <span className="h-2 w-2 rounded-full bg-[#0284c7]"></span>
        </div>
        <span className="mt-1 text-[9px] leading-none font-black tracking-tight text-slate-800">FPT</span>
        <span className="text-[6.5px] leading-none font-bold tracking-tighter text-[#0284c7]">SOFTWARE</span>
      </div>
    );
  }
  if (job.id === 6) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#b91c1c] to-[#991b1b] p-1 text-white shadow-xs">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-amber-300">
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 4.5l5 7h-3.2l-1.8-3-1.8 3H7l5-7z" />
        </svg>
        <span className="mt-0.5 text-[7px] leading-none font-black tracking-wider text-amber-100 uppercase">
          VINGROUP
        </span>
      </div>
    );
  }
  if (job.id === 7) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#dc2626] p-1 text-white shadow-xs">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 text-white">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span className="mt-1 text-[7.5px] leading-none font-black tracking-tight">WinMart</span>
      </div>
    );
  }
  if (job.id === 8) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#f43f5e] to-[#ec4899] p-1 text-white shadow-xs">
        <Heart className="h-4 w-4 fill-white text-white" />
        <span className="mt-1 text-[7.5px] leading-none font-black tracking-tight">Con Cưng</span>
      </div>
    );
  }
  if (job.id === 9) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#0284c7] p-1 text-white shadow-xs">
        <Zap className="h-4 w-4 fill-current text-yellow-300" />
        <span className="mt-1 text-[6.5px] leading-none font-black tracking-tighter text-yellow-300">
          ĐIỆN MÁY XANH
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#f0fdf4] text-[#00b14f]">
      <Zap className="h-6 w-6" />
    </div>
  );
}

export default function JobCard({ job, isSaved, onToggleSave }: JobCardProps) {
  return (
    <div className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00b14f]/70 hover:shadow-[0_16px_32px_-8px_rgba(0,177,79,0.12),0_4px_12px_-2px_rgba(0,0,0,0.04)] sm:p-5">
      {/* Top Accent Gradient Line on Hover */}
      <div className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-2xl bg-linear-to-r from-[#00b14f] via-[#10b981] to-[#047857] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Upper Section: Logo, Title, Company, Heart & Tags */}
      <div>
        {/* Header Row */}
        <div className="flex items-start gap-3.5">
          {/* Company Logo Squircle with Micro-interaction */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-linear-to-b from-white to-slate-50 p-1.5 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#00b14f]/30 group-hover:shadow-sm">
            <JobLogo job={job} />
          </div>

          {/* Title & Company */}
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.id}`}>
              <h3
                className="line-clamp-2 text-[15px] leading-[1.35] font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-[#00b14f]"
                title={job.title}
              >
                {job.title}
              </h3>
            </Link>

            <div className="mt-1.5 flex items-center gap-1.5 truncate text-[12.5px] font-medium text-slate-500">
              {job.isPro && (
                <span className="inline-flex shrink-0 items-center rounded bg-linear-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white uppercase shadow-2xs">
                  PRO
                </span>
              )}
              <span className="truncate transition-colors group-hover:text-slate-700">{job.company}</span>
              <span title="Nhà tuyển dụng xác thực">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-[#00b14f]/15 text-[#00b14f]" />
              </span>
            </div>
          </div>

          {/* Heart Save Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className={`ml-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 ${
              isSaved
                ? 'scale-105 border-[#00b14f] bg-[#ecfdf5] text-[#00b14f] shadow-xs'
                : 'border-slate-200 bg-slate-50/60 text-slate-400 hover:scale-110 hover:border-[#00b14f] hover:bg-[#ecfdf5] hover:text-[#00b14f] active:scale-95'
            }`}
            title={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm này'}
          >
            <Heart className={`h-4 w-4 transition-transform duration-200 ${isSaved ? 'fill-[#00b14f]' : ''}`} />
          </button>
        </div>

        {/* Skill & Category Tags + Optional Highlight Badge */}
        <div className="mt-3.5 mb-1 flex flex-wrap items-center gap-1.5">
          {job.highlightBadge && (
            <span className="rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 shadow-2xs">
              {job.highlightBadge}
            </span>
          )}
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md border border-slate-200/50 bg-slate-100/80 px-2.5 py-1 text-[11.5px] font-medium text-slate-600 transition-all hover:border-[#00b14f]/30 hover:bg-[#e8f5e9] hover:text-[#00b14f]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section: Salary + Location + Deadline + Quick Apply */}
      <div className="mt-3.5 border-t border-slate-100 pt-3.5">
        {/* Badges Row: Salary & Location */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex shrink-0 items-center rounded-lg border border-[#a7f3d0]/80 bg-linear-to-r from-[#e8fbf0] to-[#f0fdf4] px-3 py-1.5 text-[13px] font-extrabold text-[#00873c] shadow-2xs transition-all group-hover:border-[#00b14f]/50">
            {job.salary}
          </span>
          <span className="inline-flex max-w-36.25 shrink-0 items-center gap-1 truncate rounded-lg border border-slate-200/60 bg-slate-50 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-100">
            <MapPin className="h-3 w-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">{job.location}</span>
          </span>
        </div>

        {/* Deadline & Quick Apply Row */}
        <div className="mt-3 flex items-center justify-between pt-1 text-[11.5px] font-medium">
          <span
            className={`inline-flex items-center gap-1.5 ${
              job.isUrgentDeadline
                ? 'rounded-md border border-amber-200/50 bg-amber-50/80 px-2 py-0.5 font-semibold text-amber-700'
                : 'text-slate-400'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{job.deadline}</span>
          </span>

          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#00b14f] transition-all group-hover:translate-x-1 group-hover:text-[#009643]"
          >
            <span>Ứng tuyển ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
