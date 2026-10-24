import PageHeader from '@/components/recruiter/PageHeader';
import ApplicationsWorkspace from '@/components/recruiter/applications/ApplicationsWorkspace';
import { ROUTES } from '@/constants/routes';
import { fetchMockApplications } from '@/mocks/recruiter-application.mock';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface RecruiterApplicationsPageProps {
  searchParams: Promise<{ job?: string }>;
}

export default async function RecruiterApplicationsPage({ searchParams }: RecruiterApplicationsPageProps) {
  const [applications, params] = await Promise.all([fetchMockApplications(), searchParams]);

  return (
    <>
      <PageHeader
        title="Applications"
        description="One lane per job post — drag applications between hiring stages."
        actions={
          <Link
            href={ROUTES.RECRUITER_CANDIDATES_SAVED}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4" />
            Saved candidates
          </Link>
        }
      />

      <ApplicationsWorkspace initialApplications={applications} initialJobId={params.job ?? ''} />
    </>
  );
}
