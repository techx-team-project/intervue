import PageHeader from '@/components/recruiter/PageHeader';
import SavedCandidatesView from '@/components/recruiter/applications/SavedCandidatesView';
import { ROUTES } from '@/constants/routes';
import { fetchMockApplications } from '@/mocks/recruiter-application.mock';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SavedCandidatesPage() {
  const applications = await fetchMockApplications();
  const savedApplications = applications.filter((application) => application.isSaved);

  return (
    <>
      <PageHeader
        title="Saved candidates"
        description="Candidates you bookmarked to follow, even once their application is closed."
        actions={
          <Link
            href={ROUTES.RECRUITER_APPLICATIONS}
            className="border-outline-variant text-body-md text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-xl border bg-white px-3.5 py-2.5 font-bold transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Applications
          </Link>
        }
      />

      <SavedCandidatesView initialApplications={savedApplications} />
    </>
  );
}
