import ApplicationsBoardPage from '@/components/recruiter/applications/ApplicationsBoardPage';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ job?: string; application?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return <ApplicationsBoardPage variant="minimal" searchParams={searchParams} />;
}
