'use client';

import { ROUTES } from '@/constants/routes';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RecruiterTopNotice() {
  const [isDismissed, setIsDismissed] = useState(false);

  // If already on agreements page or dismissed, keep it hidden or let user dismiss
  if (isDismissed) return null;

  return (
    <div className="relative z-50 flex w-full items-center justify-between bg-[#eb3223] px-4 py-2 text-xs font-medium text-white shadow-sm sm:text-sm">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-1.5 pr-6 text-center leading-snug">
        <span className="font-extrabold tracking-wide uppercase">[QUAN TRỌNG]</span>
        <span>
          Từ ngày 01/01/2026, các tin tuyển dụng đang hiển thị của Quý khách sẽ KHÔNG nhận được CV ứng tuyển nếu chưa
          cập nhật Thoả thuận xử lý dữ liệu cá nhân.
        </span>
        <Link
          href={ROUTES.RECRUITER_COMPANY_AGREEMENTS}
          className="ml-1 inline-flex items-center gap-1 font-bold underline decoration-white transition-colors hover:text-amber-200"
        >
          <span>Cập nhật ngay</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-white/80 transition hover:bg-black/15 hover:text-white"
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
