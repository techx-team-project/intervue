'use client';

import { useState } from 'react';
import type { JobDetail, RelatedJob } from '@/types/job';
import JobBreadcrumb from './JobBreadcrumb';
import JobHeaderCard from './JobHeaderCard';
import JobStickyNav from './JobStickyNav';
import JobDescriptionSection from './JobDescriptionSection';
import JobCompanySidebar from './JobCompanySidebar';
import JobGeneralInfoSidebar from './JobGeneralInfoSidebar';
// import JobAiInterviewBanner from './JobAiInterviewBanner';
import JobRelatedSection from './JobRelatedSection';
import JobApplyModal from './JobApplyModal';

interface JobDetailViewProps {
  job: JobDetail;
  relatedJobs: RelatedJob[];
}

export default function JobDetailView({ job, relatedJobs }: JobDetailViewProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f5] pb-16">
      {/* 1. Sticky Mini Nav Bar */}
      <JobStickyNav job={job} onApply={() => setIsApplyOpen(true)} />

      <div className="container-topcv pt-4">
        {/* 2. Breadcrumb */}
        <JobBreadcrumb
          title={job.title}
          category={job.categories?.[0]?.name}
          onReport={() => {
            alert('Cảm ơn bạn! Đội ngũ kiểm duyệt InterVue sẽ rà soát lại thông tin tin tuyển dụng này.');
          }}
        />

        {/* 3. Job Hero Header Card */}
        <JobHeaderCard job={job} onApply={() => setIsApplyOpen(true)} isSaved={isSaved} onToggleSave={toggleSave} />

        {/* 4. Main Content Body (Grid 12 cols: 8 left, 4 right) */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN (8 cols): Job Details, Perks, Schedule, AI Banner, Related Jobs */}
          <div className="space-y-6 lg:col-span-8">
            {/* Core Job Details */}
            <JobDescriptionSection job={job} onApply={() => setIsApplyOpen(true)} />

            {/* InterVue AI Mock Interview Feature Banner */}
            {/* <JobAiInterviewBanner jobTitle={job.title} /> */}

            {/* Related Jobs Showcase */}
            <JobRelatedSection relatedJobs={relatedJobs} />
          </div>

          {/* RIGHT COLUMN (4 cols): Company Profile Card & General Info Specs */}
          <div className="sticky top-33.75 space-y-6 lg:col-span-4">
            {/* Company Profile Card */}
            <JobCompanySidebar company={job.company} />

            {/* Job General Info Specs */}
            <JobGeneralInfoSidebar job={job} />
          </div>
        </div>
      </div>

      {/* 5. Apply Modal */}
      <JobApplyModal job={job} isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </div>
  );
}
