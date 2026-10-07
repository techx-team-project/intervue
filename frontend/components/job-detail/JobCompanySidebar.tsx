'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Users, MapPin, ExternalLink, Plus, Check, CheckCircle2, Briefcase } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobCompanySidebarProps {
  company: JobDetail['company'];
}

export default function JobCompanySidebar({ company }: JobCompanySidebarProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div
      id="job-company"
      className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all"
    >
      {/* Company Header */}
      <div className="flex items-start gap-3.5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs">
          {company.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
          ) : (
            <Building2 className="h-8 w-8 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/companies/${company.id || 224996}`}>
            <h3 className="hover:text-primary line-clamp-2 text-sm font-bold text-slate-900 transition-colors">
              {company.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="text-primary h-3.5 w-3.5" />
            <span>Doanh nghiệp xác thực</span>
          </div>
        </div>
      </div>

      {/* Follow Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setIsFollowing((prev) => !prev)}
          className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
            isFollowing
              ? 'text-primary border-emerald-200 bg-emerald-50'
              : 'hover:text-primary border-slate-200 bg-slate-50/70 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40'
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Đang theo dõi ({company.followers || '1.2k'})</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Theo dõi công ty ({company.followers || '1.2k'})</span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-slate-100" />

      {/* Info List */}
      <div className="space-y-3 text-xs text-slate-600">
        {/* Quy mô */}
        <div className="flex items-start gap-2.5">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <div className="font-medium text-slate-400">Quy mô công ty:</div>
            <div className="mt-0.5 font-semibold text-slate-800">{company.size}</div>
          </div>
        </div>

        {/* Lĩnh vực */}
        <div className="flex items-start gap-2.5">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <div className="font-medium text-slate-400">Lĩnh vực hoạt động:</div>
            <div className="mt-0.5 font-semibold text-slate-800">{company.industry}</div>
          </div>
        </div>

        {/* Địa điểm */}
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <div className="font-medium text-slate-400">Địa chỉ:</div>
            <div className="mt-0.5 leading-relaxed font-medium text-slate-700">{company.address}</div>
          </div>
        </div>
      </div>

      {/* View Company Link */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <Link
          href={`/companies/${company.id || 224996}`}
          className="text-primary flex items-center justify-center gap-1.5 text-xs font-bold hover:underline"
        >
          <span>Xem trang công ty</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
