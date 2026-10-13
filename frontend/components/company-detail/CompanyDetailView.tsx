'use client';

import { useState } from 'react';
import type { CompanyDetail } from '@/types/company';
import CompanyBreadcrumb from './CompanyBreadcrumb';
import CompanyHeaderCover from './CompanyHeaderCover';
import CompanyAboutSection from './CompanyAboutSection';
import CompanyJobsSection from './CompanyJobsSection';
import CompanySidebarInfo from './CompanySidebarInfo';
import CompanyLocationSidebar from './CompanyLocationSidebar';
import CompanySimilarSidebar from './CompanySimilarSidebar';

interface CompanyDetailViewProps {
  company: CompanyDetail;
}

export default function CompanyDetailView({ company }: CompanyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  return (
    <div className="min-h-screen bg-[#f4f5f5] pb-16">
      <div className="container-topcv pt-4">
        {/* 1. Breadcrumbs */}
        <CompanyBreadcrumb companyName={company.name} />

        {/* 2. Hero Cover & Header Card */}
        <CompanyHeaderCover company={company} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 3. Main Grid (8 cols left, 4 cols right) */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Column (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            {activeTab === 'overview' ? (
              <>
                <CompanyAboutSection company={company} />
                <CompanyJobsSection jobs={company.jobs} companyName={company.name} branches={company.branches} />
              </>
            ) : (
              <CompanyJobsSection jobs={company.jobs} companyName={company.name} branches={company.branches} />
            )}
          </div>

          {/* Right Column (4 cols Sidebar) */}
          <div className="sticky top-20 space-y-6 lg:col-span-4">
            <CompanySidebarInfo company={company} />
            <CompanyLocationSidebar address={company.address} mapEmbedUrl={company.mapEmbedUrl} />
            <CompanySimilarSidebar currentCompanyId={company.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
