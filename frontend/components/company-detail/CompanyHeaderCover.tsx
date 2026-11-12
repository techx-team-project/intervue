'use client';

import FollowCompanyButton from '@/components/candidate/saved/FollowCompanyButton';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import { cn } from '@/lib/utils';
import type { CompanyDetail } from '@/types/company';
import { Check, Globe, MapPin, Share2, Users } from 'lucide-react';
import { useState } from 'react';

type CompanyTab = 'overview' | 'jobs';

interface CompanyHeaderCoverProps {
  company: CompanyDetail;
  activeTab: CompanyTab;
  onTabChange: (tab: CompanyTab) => void;
}

const COPIED_RESET_MS = 2500;
const SHORT_ADDRESS_PARTS = 2;

export default function CompanyHeaderCover({ company, activeTab, onTabChange }: CompanyHeaderCoverProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  const tabs: Array<{ id: CompanyTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'jobs', label: 'Job posts', count: company.openJobsCount },
  ];

  return (
    <header className="bg-surface border-outline-variant overflow-hidden rounded-2xl border">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex min-w-0 items-center gap-5">
          <CompanyLogo name={company.name} src={company.logo} className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-headline-sm sm:text-headline-md text-on-surface font-bold">
                {company.name}
              </h1>
              {company.featured && (
                <span className="bg-primary-container text-on-primary-container rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  Featured
                </span>
              )}
            </div>
            <ul className="text-body-md text-on-surface-variant flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {company.website && (
                <li>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="text-primary h-4 w-4" aria-hidden />
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </li>
              )}
              {company.size && (
                <li className="flex items-center gap-1.5">
                  <Users className="text-primary h-4 w-4" aria-hidden />
                  {company.size} employees
                </li>
              )}
              <li className="flex items-center gap-1.5" title={company.address}>
                <MapPin className="text-primary h-4 w-4" aria-hidden />
                {company.address.split(',').slice(-SHORT_ADDRESS_PARTS).join(', ').trim()}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <FollowCompanyButton companyId={Number(company.id)} />
          <button
            type="button"
            onClick={handleShare}
            className="border-outline-variant text-on-surface hover:border-primary hover:text-primary text-label-lg flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 font-semibold transition-colors"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
            {copied ? 'Link copied' : 'Share'}
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Company sections"
        className="border-outline-variant flex gap-1 border-t px-4 sm:px-6"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'text-body-md -mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3.5 font-semibold transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="bg-surface-container-low text-on-surface-variant rounded-full px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
}
