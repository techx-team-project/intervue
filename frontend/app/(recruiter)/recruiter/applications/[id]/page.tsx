import ReviewApplicationDetailView from '@/components/recruiter/applications/review/ReviewApplicationDetailView';
import { notFound } from 'next/navigation';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  return <ReviewApplicationDetailView applicationId={id} />;
}
