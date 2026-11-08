'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
      const publicUrl = `${window.location.origin}/jobs/${job.id}`;
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Đã sao chép liên kết công khai của tin tuyển dụng!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="border-outline-variant/90 relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition sm:p-7">
      <div className="bg-primary absolute inset-x-0 top-0 h-1.5" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="border-outline-variant relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-2 shadow-xs sm:h-24 sm:w-24">
            {job.company.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                loading="lazy"
                decoding="async"
                src={job.company.logo}
                alt={job.company.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="text-outline h-10 w-10" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {job.isPro && (
                <span className="bg-primary text-label-sm inline-flex items-center rounded-md px-2 py-0.5 font-bold tracking-wider text-white uppercase shadow-2xs">
                  PRO VIP
                </span>
              )}
              {job.highlightBadge && (
                <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {job.highlightBadge}
                </span>
              )}
            </div>

            <h1 className="text-on-surface mt-1.5 text-xl font-bold tracking-tight sm:text-2xl lg:text-[26px]">
              {job.title}
            </h1>

            <div className="text-on-surface-variant mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="hover:text-primary text-on-surface font-semibold">{job.company.name}</span>

              <div className="relative inline-block">
                <button
                  type="button"
                  onMouseEnter={() => setShowVerifyTooltip(true)}
                  onMouseLeave={() => setShowVerifyTooltip(false)}
                  onClick={() => setShowVerifyTooltip((prev) => !prev)}
                  className="text-primary border-primary/30 bg-primary-light hover:bg-primary-container inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors"
                >
                  <CheckCircle2 className="fill-primary/20 text-primary h-3.5 w-3.5" />
                  <span>Đã xác thực</span>
                </button>

                {showVerifyTooltip && (
                  <div className="border-outline-variant text-on-surface shadow-elevation-2 absolute top-full left-0 z-40 mt-1.5 w-72 rounded-xl border bg-white p-3.5 text-xs">
                    <div className="text-on-surface mb-1.5 flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="text-primary h-4 w-4" />
                      <span>Nhà tuyển dụng đã được xác thực</span>
                    </div>
                    <ul className="text-on-surface-variant space-y-1">
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

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              <div className="bg-primary-light rounded-xl border border-emerald-200/90 p-2.5 sm:p-3">
                <div className="text-on-primary-container flex items-center gap-1.5 text-xs font-medium">
                  <Banknote className="text-primary h-3.5 w-3.5" />
                  <span>Mức lương</span>
                </div>
                <div className="text-primary mt-1 text-sm font-bold sm:text-base">{job.salary.display}</div>
              </div>

              <div className="border-outline-variant bg-surface-container-low/70 rounded-xl border p-2.5 sm:p-3">
                <div className="text-label-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
                  <MapPin className="text-on-surface-variant h-3.5 w-3.5" />
                  <span>Địa điểm</span>
                </div>
                <div className="text-body-md text-on-surface sm:text-body-lg mt-1 truncate font-bold">
                  {job.location.city}
                </div>
              </div>

              <div className="border-outline-variant bg-surface-container-low/70 rounded-xl border p-2.5 sm:p-3">
                <div className="text-label-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
                  <Briefcase className="text-on-surface-variant h-3.5 w-3.5" />
                  <span>Kinh nghiệm</span>
                </div>
                <div className="text-body-md text-on-surface sm:text-body-lg mt-1 font-bold">{job.experience}</div>
              </div>

              <div className="border-outline-variant bg-surface-container-low/70 rounded-xl border p-2.5 sm:p-3">
                <div className="text-label-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
                  <Clock className="text-on-surface-variant h-3.5 w-3.5" />
                  <span>Hạn nộp hồ sơ</span>
                </div>
                <div className="text-body-md text-on-surface sm:text-body-md mt-1 truncate font-bold">
                  {job.deadline}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-64 lg:shrink-0">
          <button
            type="button"
            onClick={onApply}
            className="group bg-primary shadow-elevation-1 hover:shadow-elevation-2 relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-extrabold text-white shadow-emerald-500/20 transition duration-200 active:translate-y-0 active:scale-[0.98]"
          >
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span>Ứng tuyển ngay</span>
            <Sparkles className="h-4 w-4 text-emerald-200" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleSave}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                isSaved
                  ? 'text-primary border-primary/40 bg-primary-light'
                  : 'hover:text-primary border-outline-variant text-on-surface hover:border-primary/40 bg-white hover:bg-emerald-50/50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-outline'}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="border-outline-variant text-on-surface hover:bg-surface-container-low relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-3.5 py-2 text-xs font-semibold transition"
              title="Sao chép liên kết chia sẻ"
            >
              <Share2 className="text-on-surface-variant h-4 w-4" />
              <span>Chia sẻ</span>
              {copied && (
                <div className="shadow-elevation-2 absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white">
                  Đã copy link!
                </div>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs">
            <div className="text-on-surface flex items-center justify-between">
              <span className="text-on-primary-container flex items-center gap-1 font-semibold">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                InterVue ATS Match
              </span>
              <span className="text-primary font-bold">{job.atsMatchScore}%</span>
            </div>
            <div className="bg-primary-container mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full rounded-full" style={{ width: `${job.atsMatchScore}%` }} />
            </div>
            <p className="text-on-surface-variant mt-1 text-xs">
              Hồ sơ của bạn rất phù hợp với tiêu chí tuyển dụng này!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
