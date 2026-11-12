import RecruiterInterviewsView from '@/components/recruiter/interviews/RecruiterInterviewsView';
import PageHeader from '@/components/recruiter/PageHeader';

export default function RecruiterInterviewsPage() {
  return (
    <>
      <PageHeader
        title="Interview schedule"
        description="Track invited interviews and see which candidates confirmed or asked to reschedule."
      />
      <RecruiterInterviewsView />
    </>
  );
}
