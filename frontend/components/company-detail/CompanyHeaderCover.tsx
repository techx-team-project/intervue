'use client';

import { useState } from 'react';
import { Globe, Users, CheckCircle2, Plus, Check, Share2, Briefcase, MapPin } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanyHeaderCoverProps {
  company: CompanyDetail;
  activeTab: 'overview' | 'jobs';
  onTabChange: (tab: 'overview' | 'jobs') => void;
}

export default function CompanyHeaderCover({ company, activeTab, onTabChange }: CompanyHeaderCoverProps) {
  const [isFollowing, setIsFollowing] = useState(false);
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
      {/* 1. Cover Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 sm:h-64 lg:h-72">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${company.cover})` }}
        />
        {/* Soft emerald dark overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

        {/* Top Badges / Tagline */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {company.isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00b14f]" />
              <span>Doanh nghiệp xác thực</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Company Info Row */}
      <div className="relative px-5 pt-0 pb-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Logo + Titles */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Logo squircle overlapping cover */}
            <div className="relative -mt-16 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-2 shadow-md sm:-mt-20 sm:h-32 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
            </div>

            {/* Name & Tagline */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{company.name}</h1>
              </div>

              {company.tagline && (
                <p className="mt-1 text-xs text-slate-500 italic sm:text-[13px]">&ldquo;{company.tagline}&rdquo;</p>
              )}

              {/* Badges metadata row */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#00b14f] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{company.website.replace('https://', '')}</span>
                  </a>
                )}

                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>{company.size}</span>
                </span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span title={company.address}>
                    {company.address ? company.address.split(',').slice(-2).join(', ').trim() : 'Việt Nam'}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                  <span>{company.followers} người theo dõi</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
            {/* Follow button */}
            <button
              type="button"
              onClick={() => setIsFollowing((prev) => !prev)}
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isFollowing
                  ? 'border border-emerald-300 bg-emerald-50 text-[#00b14f]'
                  : 'bg-[#00b14f] text-white shadow-xs hover:bg-[#009643]'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đang theo dõi</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Theo dõi</span>
                </>
              )}
            </button>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              title="Sao chép liên kết trang công ty"
            >
              <Share2 className="h-4 w-4 text-slate-500" />
              <span>Chia sẻ</span>
              {copied && (
                <div className="animate-in fade-in absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-lg">
                  Đã copy link!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs Bar */}
      <div className="border-t border-slate-200 bg-slate-50/70 px-5 sm:px-7">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('overview')}
            className={`cursor-pointer border-b-2 px-3 py-3 text-[13.5px] font-bold transition-all ${
              activeTab === 'overview'
                ? 'border-[#00b14f] text-[#00b14f]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tổng quan
          </button>

          <button
            type="button"
            onClick={() => onTabChange('jobs')}
            className={`flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-3 text-[13.5px] font-bold transition-all ${
              activeTab === 'jobs'
                ? 'border-[#00b14f] text-[#00b14f]'
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
