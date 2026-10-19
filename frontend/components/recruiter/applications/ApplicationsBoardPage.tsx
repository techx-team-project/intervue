import PageHeader from '@/components/recruiter/PageHeader';
import { getBoardVariantMeta, type ApplicationsBoardVariant } from '@/constants/application-board';
import { ROUTES } from '@/constants/routes';
import { fetchMockApplications } from '@/mocks/recruiter-application.mock';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import ApplicationsWorkspace from './ApplicationsWorkspace';

interface ApplicationsBoardPageProps {
  variant: ApplicationsBoardVariant;
  searchParams: Promise<{ job?: string; application?: string }>;
}

export default async function ApplicationsBoardPage({ variant, searchParams }: ApplicationsBoardPageProps) {
  const [applications, params] = await Promise.all([fetchMockApplications(), searchParams]);
  const meta = getBoardVariantMeta(variant);

  return (
    <>
      <PageHeader
        title="Hồ sơ ứng tuyển"
        description={meta.description}
        actions={
          <Link
            href={ROUTES.RECRUITER_CANDIDATES_SAVED}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4" />
            Ứng viên đã lưu
          </Link>
        }
      />

      <ApplicationsWorkspace
        initialApplications={applications}
        variant={variant}
        initialJobId={params.job ?? ''}
        initialApplicationId={params.application ?? null}
      />
    </>
  );
}
