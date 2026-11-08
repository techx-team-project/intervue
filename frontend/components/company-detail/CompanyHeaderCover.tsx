'use client';

import { useState } from 'react';
import { Briefcase, Building2, Globe, MapPin, Share2, Users } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanyHeaderCoverProps {
  company: CompanyDetail;
  activeTab: 'overview' | 'jobs';
  onTabChange: (tab: 'overview' | 'jobs') => void;
}

export default function CompanyHeaderCover({ company, activeTab, onTabChange }: CompanyHeaderCoverProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="h-28 w-full bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-500 sm:h-40" />

      <div className="relative px-5 pt-0 pb-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-16 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-2 shadow-md sm:-mt-20 sm:h-32 sm:w-32">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  loading="lazy"
                  decoding="async"
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-12 w-12 text-slate-300" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{company.name}</h1>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{company.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}

                {company.size && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{company.size}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span title={company.address}>{company.address.split(',').slice(-2).join(', ').trim()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleShare}
              className="relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              title="Sao chép liên kết trang công ty"
            >
              <Share2 className="h-4 w-4 text-slate-500" />
              <span>Chia sẻ</span>
              {copied && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-lg">
                  Đã copy link!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/70 px-5 sm:px-7">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('overview')}
            className={`cursor-pointer border-b-2 px-3 py-3 text-[13.5px] font-bold transition ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tổng quan
          </button>

          <button
            type="button"
            onClick={() => onTabChange('jobs')}
            className={`flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-3 text-[13.5px] font-bold transition ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Tin tuyển dụng</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'jobs' ? 'bg-emerald-100 text-[#00873c]' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {company.openJobsCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
