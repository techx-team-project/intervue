'use client';

import Link from 'next/link';
import { ChevronRight, Home, ShieldAlert } from 'lucide-react';

interface JobBreadcrumbProps {
  title: string;
  category?: string;
  onReport?: () => void;
}

export default function JobBreadcrumb({
  title,
  category = 'Kế toán / Kiểm toán / Thuế',
  onReport,
}: JobBreadcrumbProps) {
  return (
    <nav className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-slate-500">
      <div className="flex items-center gap-1.5 overflow-hidden">
        <Link href="/" className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-[#00b14f]">
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Trang chủ</span>
        </Link>

        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />

        <Link href="/#feature-jobs" className="truncate text-slate-500 transition-colors hover:text-[#00b14f]">
          Tìm việc làm
        </Link>

        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />

        <span className="max-w-35 truncate text-slate-500 sm:max-w-none">{category}</span>

        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />

        <span className="max-w-50 truncate font-semibold text-slate-800 sm:max-w-xs md:max-w-md">{title}</span>
      </div>

      <button
        type="button"
        onClick={onReport}
        className="inline-flex cursor-pointer items-center gap-1 text-[12.5px] font-medium text-slate-500 transition-colors hover:text-red-600"
        title="Báo cáo tin tuyển dụng không chính xác"
      >
        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
        <span>Báo cáo tin này</span>
      </button>
    </nav>
  );
}
