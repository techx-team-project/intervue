import ReviewApplicationsView from '@/components/recruiter/applications/review/ReviewApplicationsView';
import PageHeader from '@/components/recruiter/PageHeader';
import { Suspense } from 'react';

export default function RecruiterApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Hồ sơ ứng tuyển"
        description="Xem, đánh giá và cập nhật trạng thái hồ sơ ứng viên nộp vào công ty bạn."
      />
      <Suspense>
        <ReviewApplicationsView />
      </Suspense>
    </>
  );
}
