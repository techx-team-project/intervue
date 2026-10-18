'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterVerificationStatus } from '@/types/recruiter';
import { ShieldAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface VerificationStatusBannerProps {
  verification: RecruiterVerificationStatus;
}

export default function VerificationStatusBanner({ verification }: VerificationStatusBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (verification.level === 'verified' || isDismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:items-center sm:p-5">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 sm:mt-0" />

      <div className="min-w-0 flex-1">
        <p className="text-navy text-[13.5px] font-bold">
          Tài khoản đã xác thực {verification.stepsCompleted}/{verification.stepsTotal} bước
        </p>
        <p className="mt-0.5 text-[12.5px] text-[#64748b]">
          Hoàn tất xác thực để đăng tin tuyển dụng và tiếp cận ứng viên hiệu quả hơn.
        </p>
      </div>

      <Link
        href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
        className="shrink-0 rounded-full bg-amber-600 px-4 py-1.5 text-[12.5px] font-bold text-white transition-colors hover:bg-amber-700"
      >
        {verification.nextStepLabel}
      </Link>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Đóng"
        className="shrink-0 cursor-pointer rounded-lg p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
