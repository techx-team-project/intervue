'use client';

import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CompanyVerificationHero } from './CompanyVerificationHero';
import { VerificationChecklist } from './VerificationChecklist';

export function CompanyVerificationView() {
  const { profile, handlePresetLevel } = useCompanyVerification();
  const [showBottomPromo, setShowBottomPromo] = useState(true);

  return (
    <div className="space-y-6 pb-12">
      {/* Main unified card layout (Left = Emerald Hero stats, Right = Checklist) matching TopCV */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm lg:grid-cols-12">
        {/* Left Column (5 cols on lg) */}
        <div className="flex flex-col bg-[#009647] lg:col-span-5">
          <CompanyVerificationHero profile={profile} onPresetLevelChange={handlePresetLevel} />
        </div>

        {/* Right Column (7 cols on lg) */}
        <div className="flex flex-col bg-white lg:col-span-7">
          <VerificationChecklist profile={profile} />
        </div>
      </div>

      {/* Bottom Promo Banner - Contained strictly inside the page content area (not covering sidebar) */}
      {showBottomPromo && (
        <div className="mx-auto border border-emerald-800/20 bg-gradient-to-r from-[#035942] via-[#026c50] to-[#014734] px-6 py-4 text-white shadow-xl transition-all">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3.5 text-xs sm:text-sm">
              <span className="text-2xl select-none">👉</span>
              <p className="leading-relaxed">
                <span className="font-extrabold text-amber-300">Cơ hội cuối cùng!!</span> Chỉ còn{' '}
                <span className="font-bold text-white">16 ngày : 22 giờ : 35 phút</span> để nhận{' '}
                <span className="font-extrabold text-emerald-200">+2 InterPoint</span> ngay khi đăng tin tuyển dụng đầu
                tiên. Đăng tin tuyển dụng trên InterVue có gì khác biệt?{' '}
                <Link href={ROUTES.RECRUITER_JOBS_CREATE} className="font-semibold underline hover:text-emerald-100">
                  Tìm hiểu ngay
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={ROUTES.RECRUITER_JOBS_CREATE}
                className="rounded-full bg-white px-5 py-2 text-xs font-bold text-[#035942] shadow-md transition hover:scale-105 hover:bg-emerald-50 active:scale-95"
              >
                Đăng tin ngay
              </Link>
              <button
                type="button"
                onClick={() => setShowBottomPromo(false)}
                className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Đóng ưu đãi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
