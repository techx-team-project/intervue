'use client';

import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { Gift, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CompanyVerificationHero } from './CompanyVerificationHero';
import { VerificationChecklist } from './VerificationChecklist';

export function CompanyVerificationView() {
  const { profile, handlePresetLevel } = useCompanyVerification();
  const [showBottomPromo, setShowBottomPromo] = useState(true);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6">
        {/* Main unified card layout (Left = Emerald Hero stats, Right = Checklist) matching TopCV */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm lg:grid-cols-12">
          {/* Left Column (5 cols on lg) */}
          <div className="flex flex-col bg-[#009647] lg:col-span-6">
            <CompanyVerificationHero profile={profile} onPresetLevelChange={handlePresetLevel} />
          </div>

          {/* Right Column (7 cols on lg) */}
          <div className="flex flex-col bg-white lg:col-span-6">
            <VerificationChecklist profile={profile} />
          </div>
        </div>
      </div>

      {/* Bottom promo: the negative margins must mirror the padding of <main> in
          RecruiterShell (px-2 sm:px-3 lg:px-5, py-6 sm:py-5) so the bar stops exactly
          at the sidebar instead of overlapping it. Update both together.
          `sticky bottom-0` pins it while the page content scrolls behind. */}
      {showBottomPromo && (
        <div className="sticky bottom-0 z-30 -mx-2 mt-6 -mb-6 overflow-hidden bg-gradient-to-r from-[#06873f] via-[#0f9b50] to-[#3bb673] text-white shadow-[0_-6px_18px_-8px_rgba(0,0,0,0.35)] sm:-mx-3 sm:-mb-5 lg:-mx-5">
          <div className="flex items-stretch">
            {/* Decorative tile — kept lighter than the content band so the two read as
                separate blocks. Swap for a real illustration by dropping one in /public. */}
            <div
              aria-hidden
              className="relative hidden w-40 shrink-0 overflow-hidden border-r border-white/25 bg-gradient-to-br from-[#2cc06f] to-[#5ad28d] shadow-[inset_-8px_0_14px_-10px_rgba(0,0,0,0.45)] sm:block"
            >
              <span className="absolute -top-5 -left-4 h-16 w-16 rounded-full bg-white/25 blur-md" />
              <span className="absolute right-3 -bottom-6 h-20 w-20 rounded-full bg-lime-100/30 blur-lg" />
              <span className="absolute top-3 right-4 h-1.5 w-1.5 rounded-full bg-white/80" />
              <span className="absolute top-8 right-10 h-1 w-1 rounded-full bg-white/60" />

              <div className="relative flex h-full flex-col items-center justify-center gap-1">
                <Gift className="h-9 w-9 text-white drop-shadow-sm" strokeWidth={1.75} />
                <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-black tracking-wide text-[#06813f] uppercase">
                  InterPoint
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 py-4 pr-10 pl-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5 sm:pr-12 sm:pl-6">
              <div className="min-w-0 space-y-1">
                <p className="text-[13px] leading-snug sm:text-sm">
                  <span className="mr-1 select-none">👉</span>
                  <span className="font-bold">Cơ hội cuối cùng!!</span> Chỉ còn{' '}
                  <span className="font-bold text-[#c9f9dc]">16 ngày : 22 giờ : 35 phút</span> để nhận{' '}
                  <span className="font-bold text-[#c9f9dc] underline underline-offset-2">+2 InterPoint</span> ngay khi
                  đăng tin tuyển dụng đầu tiên
                </p>
                <p className="text-[12px] leading-snug text-white/90 sm:text-[13px]">
                  Đăng tin tuyển dụng trên InterVue có gì khác biệt?{' '}
                  <Link
                    href={ROUTES.RECRUITER_JOBS_CREATE}
                    className="font-semibold text-white underline underline-offset-2 transition hover:text-emerald-100"
                  >
                    Tìm hiểu ngay
                  </Link>
                </p>
              </div>

              <Link
                href={ROUTES.RECRUITER_JOBS_CREATE}
                className="shrink-0 self-start rounded-lg bg-white px-5 py-2.5 text-[13px] font-bold text-[#06873f] shadow-md transition hover:bg-emerald-50 active:scale-95 sm:self-auto"
              >
                Đăng tin ngay
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBottomPromo(false)}
            className="absolute top-2.5 right-3 rounded p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Đóng ưu đãi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
