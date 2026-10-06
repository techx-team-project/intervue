'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getSimilarCompanies, SIMILAR_COMPANIES } from '@/mocks/company-detail.mock';

interface CompanySimilarSidebarProps {
  currentCompanyId?: string | number;
}

export default function CompanySimilarSidebar({ currentCompanyId }: CompanySimilarSidebarProps) {
  const similarCompanies = currentCompanyId ? getSimilarCompanies(currentCompanyId) : SIMILAR_COMPANIES;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-[#00b14f]" />
          <span>Doanh nghiệp tiêu biểu khác</span>
        </h3>

        <Link
          href="/#top-companies"
          className="flex items-center gap-0.5 text-[11.5px] font-bold text-[#00b14f] hover:underline"
        >
          <span>Xem thêm</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 space-y-3.5">
        {similarCompanies.map((comp) => (
          <Link
            key={comp.id}
            href={`/companies/${comp.id}`}
            className="group flex items-start gap-3 rounded-xl border border-slate-100 p-2.5 transition-all hover:border-emerald-200 hover:bg-emerald-50/20"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs group-hover:border-[#00b14f]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comp.logo} alt={comp.name} className="h-full w-full object-contain" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-1 text-xs font-bold text-slate-800 transition-colors group-hover:text-[#00b14f]">
                {comp.name}
              </h4>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">{comp.industry}</p>
              <div className="mt-1 flex items-center gap-2 text-[10.5px] text-slate-400">
                <span>{comp.followers} theo dõi</span>
                <span>•</span>
                <span className="font-semibold text-[#00873c]">{comp.openJobs} việc làm</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
