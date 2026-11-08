'use client';

import { useState } from 'react';
import type { CompanyDetail } from '@/types/company';
import CompanyBreadcrumb from './CompanyBreadcrumb';
import CompanyHeaderCover from './CompanyHeaderCover';
import CompanyAboutSection from './CompanyAboutSection';
import CompanyJobsSection from './CompanyJobsSection';
import CompanySidebarInfo from './CompanySidebarInfo';
import CompanyLocationSidebar from './CompanyLocationSidebar';

interface CompanyDetailViewProps {
  company: CompanyDetail;
}

export default function CompanyDetailView({ company }: CompanyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  return (
    <div className="bg-surface-container-low min-h-screen pb-16">
      <div className="container-page pt-4">
        <CompanyBreadcrumb companyName={company.name} />

        <CompanyHeaderCover company={company} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {activeTab === 'overview' ? (
              <>
                <CompanyAboutSection company={company} />
                <CompanyJobsSection jobs={company.jobs} companyName={company.name} />
              </>
            ) : (
              <CompanyJobsSection jobs={company.jobs} companyName={company.name} />
            )}
          </div>

          <div className="sticky top-20 space-y-6 lg:col-span-4">
            <CompanySidebarInfo company={company} />
            <CompanyLocationSidebar address={company.address} />
          </div>
        </div>
      </div>
    </div>
  );
}
