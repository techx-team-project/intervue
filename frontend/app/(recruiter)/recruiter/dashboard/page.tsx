import PageHeader from '@/components/recruiter/PageHeader';
import RecruiterDashboardView from '@/components/recruiter/RecruiterDashboardView';
import { MOCK_RECRUITER_DASHBOARD } from '@/mocks/recruiter-dashboard.mock';

export default function RecruiterDashboardPage() {
  return (
    <>
      <PageHeader title="Bảng tin" />
      <RecruiterDashboardView data={MOCK_RECRUITER_DASHBOARD} />
    </>
  );
}
