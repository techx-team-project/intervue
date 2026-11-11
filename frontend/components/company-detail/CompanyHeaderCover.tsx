'use client';

import { useState } from 'react';
import { Award, Briefcase, Building2, Globe, MapPin, Share2, Sparkles, Users } from 'lucide-react';
import FollowCompanyButton from '@/components/candidate/saved/FollowCompanyButton';
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
    <div className="border-outline-variant/90 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="bg-primary h-28 w-full sm:h-40" />

      <div className="relative px-5 pt-0 pb-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="shadow-elevation-1 relative -mt-16 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white p-2 sm:-mt-20 sm:h-32 sm:w-32">
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
                <Building2 className="text-outline h-12 w-12" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-on-surface text-xl font-bold tracking-tight sm:text-2xl">{company.name}</h1>
                {company.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    <Award className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                    Doanh nghiệp nổi bật
                  </span>
                )}
                {company.brandPageActive && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                    Brand Page
                  </span>
                )}
              </div>

              <div className="text-on-surface-variant mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
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
                    <Users className="text-outline h-3.5 w-3.5" />
                    <span>{company.size}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  <MapPin className="text-outline h-3.5 w-3.5" />
                  <span title={company.address}>{company.address.split(',').slice(-2).join(', ').trim()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
            <FollowCompanyButton companyId={Number(company.id)} />
            <button
              type="button"
              onClick={handleShare}
              className="border-outline-variant text-on-surface hover:bg-surface-container-low relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-semibold transition-colors"
              title="Copy company page link"
            >
              <Share2 className="text-on-surface-variant h-4 w-4" />
              <span>Share</span>
              {copied && (
                <div className="text-label-sm shadow-elevation-2 absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1 font-medium whitespace-nowrap text-white">
                  Link copied!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-outline-variant bg-surface-container-low/70 border-t px-5 sm:px-7">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('overview')}
            className={`text-body-md cursor-pointer border-b-2 px-3 py-3 font-bold transition ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => onTabChange('jobs')}
            className={`text-body-md flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-3 font-bold transition ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Job posts</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'jobs'
                  ? 'bg-primary-container text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
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
