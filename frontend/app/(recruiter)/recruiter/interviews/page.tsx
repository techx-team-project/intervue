import RecruiterInterviewsView from '@/components/recruiter/interviews/RecruiterInterviewsView';
import PageHeader from '@/components/recruiter/PageHeader';

export default function RecruiterInterviewsPage() {
  return (
    <>
      <PageHeader
        title="Lịch phỏng vấn"
        description="Theo dõi các buổi phỏng vấn đã mời, ứng viên đã xác nhận hay xin đổi giờ."
      />
      <RecruiterInterviewsView />
    </>
  );
}
