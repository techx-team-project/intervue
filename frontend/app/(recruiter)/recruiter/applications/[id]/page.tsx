import ApplicationDetailPageView from '@/components/recruiter/applications/ApplicationDetailPageView';
import { fetchMockApplication } from '@/mocks/recruiter-application.mock';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  const application = await fetchMockApplication(id);

  if (!application) notFound();

  return <ApplicationDetailPageView initialApplication={application} />;
}
