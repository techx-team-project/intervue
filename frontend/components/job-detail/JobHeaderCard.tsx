'use client';

import { useState } from 'react';
import {
  Banknote,
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Building2,
  Check,
} from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobHeaderCardProps {
  job: JobDetail;
  onApply: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function JobHeaderCard({ job, onApply, isSaved, onToggleSave }: JobHeaderCardProps) {
  const [copied, setCopied] = useState(false);
  const [showVerifyTooltip, setShowVerifyTooltip] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all sm:p-7">
      {/* Top Emerald Gradient Accent Bar */}
      <div className="from-primary absolute inset-x-0 top-0 h-1.5 bg-linear-to-r via-emerald-500 to-emerald-700" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Logo + Info */}
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Company Logo Squircle */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xs sm:h-24 sm:w-24">
            {job.company.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-contain" />
            ) : (
              <Building2 className="h-10 w-10 text-slate-400" />
            )}
          </div>

          {/* Title & Company Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {job.isPro && (
                <span className="inline-flex items-center rounded-md bg-linear-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-2xs">
                  PRO VIP
                </span>
              )}
              {job.highlightBadge && (
                <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {job.highlightBadge}
                </span>
              )}
            </div>

            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">
              {job.title}
            </h1>

            {/* Company Name with Verified Employer Badge */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="hover:text-primary font-semibold text-slate-700">{job.company.name}</span>

              {/* Verified badge with interactive tooltip */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onMouseEnter={() => setShowVerifyTooltip(true)}
                  onMouseLeave={() => setShowVerifyTooltip(false)}
                  onClick={() => setShowVerifyTooltip((prev) => !prev)}
                  className="text-primary inline-flex cursor-pointer items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold transition-colors hover:bg-emerald-100"
                >
                  <CheckCircle2 className="fill-primary/20 text-primary h-3.5 w-3.5" />
                  <span>Đã xác thực</span>
                </button>

                {showVerifyTooltip && (
                  <div className="absolute top-full left-0 z-40 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 shadow-xl">
                    <div className="mb-1.5 flex items-center gap-1.5 font-bold text-slate-900">
                      <ShieldCheck className="text-primary h-4 w-4" />
                      <span>Nhà tuyển dụng đã được xác thực</span>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {job.verifiedBadges.map((badge, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="text-primary h-3 w-3 shrink-0" />
                          <span>{badge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Key Highlight Badges Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {/* Mức lương */}
              <div className="rounded-xl border border-emerald-200/90 bg-linear-to-br from-emerald-50/70 to-teal-50/40 p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
                  <Banknote className="text-primary h-3.5 w-3.5" />
                  <span>Mức lương</span>
                </div>
                <div className="mt-1 text-sm font-black text-emerald-700 sm:text-base">{job.salary.display}</div>
              </div>

              {/* Địa điểm */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-600" />
                  <span>Địa điểm</span>
                </div>
                <div className="mt-1 truncate text-[14px] font-bold text-slate-800 sm:text-[15px]">
                  {job.location.city}
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                  <Briefcase className="h-3.5 w-3.5 text-slate-600" />
                  <span>Kinh nghiệm</span>
                </div>
                <div className="mt-1 text-[14px] font-bold text-slate-800 sm:text-[15px]">{job.experience}</div>
              </div>

              {/* Hạn nộp */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-600" />
                  <span>Hạn nộp hồ sơ</span>
                </div>
                <div className="mt-1 truncate text-[13.5px] font-bold text-slate-800 sm:text-[14px]">
                  {job.deadline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex flex-col gap-3 lg:w-64 lg:shrink-0">
          {/* Main Apply Button */}
          <button
            type="button"
            onClick={onApply}
            className="group from-primary relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r to-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
          >
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span>Ứng tuyển ngay</span>
            <Sparkles className="h-4 w-4 text-emerald-200" />
          </button>

          {/* Secondary Action Row: Lưu tin & Chia sẻ */}
          <div className="flex items-center gap-2.5">
            {/* Lưu tin button */}
            <button
              type="button"
              onClick={onToggleSave}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                isSaved
                  ? 'text-primary border-emerald-300 bg-emerald-50'
                  : 'hover:text-primary border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-slate-400'}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
            </button>

            {/* Chia sẻ button */}
            <button
              type="button"
              onClick={handleShare}
              className="relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
              title="Sao chép liên kết chia sẻ"
            >
              <Share2 className="h-4 w-4 text-slate-500" />
              <span>Chia sẻ</span>
              {copied && (
                <div className="animate-in fade-in absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white shadow-lg">
                  Đã copy link!
                </div>
              )}
            </button>
          </div>

          {/* InterVue ATS Match Score Widget */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                InterVue ATS Match
              </span>
              <span className="text-primary font-black">{job.atsMatchScore}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="to-primary h-full rounded-full bg-linear-to-r from-emerald-400"
                style={{ width: `${job.atsMatchScore}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Hồ sơ của bạn rất phù hợp với tiêu chí tuyển dụng này!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
