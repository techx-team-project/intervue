'use client';

import type { CompanyDetail } from '@/types/company';
import { useState } from 'react';
import CompanyAboutSection from './CompanyAboutSection';
import CompanyBreadcrumb from './CompanyBreadcrumb';
import CompanyHeaderCover from './CompanyHeaderCover';
import CompanyJobsSection from './CompanyJobsSection';
import CompanyLocationSidebar from './CompanyLocationSidebar';
import CompanySidebarInfo from './CompanySidebarInfo';

interface CompanyDetailViewProps {
  company: CompanyDetail;
}

export default function CompanyDetailView({ company }: CompanyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  return (
    <>
      <CompanyBreadcrumb companyName={company.name} />

      <div className="container-page space-y-6 py-8">
        <CompanyHeaderCover company={company} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            {activeTab === 'overview' && <CompanyAboutSection company={company} />}
            <CompanyJobsSection jobs={company.jobs} companyName={company.name} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <CompanySidebarInfo company={company} />
            <CompanyLocationSidebar address={company.address} />
          </aside>
        </div>
      </div>
    </>
  );
}
