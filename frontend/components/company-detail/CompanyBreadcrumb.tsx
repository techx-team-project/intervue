'use client';

import Link from 'next/link';
import { ChevronRight, Home, Building2 } from 'lucide-react';

interface CompanyBreadcrumbProps {
  companyName: string;
}

export default function CompanyBreadcrumb({ companyName }: CompanyBreadcrumbProps) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
      <Link href="/" className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-[#00b14f]">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />

      <Link
        href="/#top-companies"
        className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-[#00b14f]"
      >
        <Building2 className="h-3.5 w-3.5 text-slate-400" />
        <span>Danh sách công ty</span>
      </Link>

      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />

      <span className="max-w-64 truncate font-semibold text-slate-800 sm:max-w-md">{companyName}</span>
    </nav>
  );
}
