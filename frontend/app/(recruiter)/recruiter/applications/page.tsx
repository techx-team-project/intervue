import ReviewApplicationsView from '@/components/recruiter/applications/review/ReviewApplicationsView';
import PageHeader from '@/components/recruiter/PageHeader';
import { Suspense } from 'react';

export default function RecruiterApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Review, evaluate and update the status of applications submitted to your company."
      />
      <Suspense>
        <ReviewApplicationsView />
      </Suspense>
    </>
  );
}
