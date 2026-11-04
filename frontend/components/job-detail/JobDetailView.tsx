'use client';

import { useState } from 'react';
import type { JobDetail, RelatedJob } from '@/types/job';
import { toast } from 'sonner';
import JobBreadcrumb from './JobBreadcrumb';
import JobHeaderCard from './JobHeaderCard';
import JobStickyNav from './JobStickyNav';
import JobDescriptionSection from './JobDescriptionSection';
import JobCompanySidebar from './JobCompanySidebar';
import JobGeneralInfoSidebar from './JobGeneralInfoSidebar';
import JobRelatedSection from './JobRelatedSection';
import JobApplyModal from './JobApplyModal';

interface JobDetailViewProps {
  job: JobDetail;
  relatedJobs: RelatedJob[];
  isPreviewMode?: boolean;
}

export default function JobDetailView({ job, relatedJobs, isPreviewMode = false }: JobDetailViewProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      if (isPreviewMode) {
        toast.info(
          next
            ? 'Chế độ xem trước: Đã lưu tin vào danh sách quan tâm (mô phỏng thao tác của ứng viên).'
            : 'Chế độ xem trước: Đã hủy lưu tin (mô phỏng thao tác của ứng viên).',
        );
      }
      return next;
    });
  };

  const handleReport = () => {
    if (isPreviewMode) {
      toast.warning(
        'Chế độ xem trước: Tính năng Báo cáo tin vi phạm chỉ dành cho ứng viên khi phát hiện nội dung sai phạm.',
      );
      return;
    }
    toast.success('Cảm ơn bạn! Đội ngũ kiểm duyệt InterVue sẽ rà soát lại thông tin tin tuyển dụng này.');
  };

  return (
    <div className="min-h-screen bg-[#f4f5f5] pb-16">
      <JobStickyNav job={job} onApply={() => setIsApplyOpen(true)} />

      <div className="container-topcv pt-4">
        <JobBreadcrumb title={job.title} category={job.categories?.[0]?.name} onReport={handleReport} />

        <JobHeaderCard job={job} onApply={() => setIsApplyOpen(true)} isSaved={isSaved} onToggleSave={toggleSave} />

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <JobDescriptionSection job={job} onApply={() => setIsApplyOpen(true)} onReport={handleReport} />

            <JobRelatedSection relatedJobs={relatedJobs} />
          </div>

          <div className="sticky top-33.75 space-y-6 lg:col-span-4">
            <JobCompanySidebar company={job.company} isPreviewMode={isPreviewMode} />

            <JobGeneralInfoSidebar job={job} />
          </div>
        </div>
      </div>

      <JobApplyModal
        job={job}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        isPreviewMode={isPreviewMode}
      />
    </div>
  );
}
