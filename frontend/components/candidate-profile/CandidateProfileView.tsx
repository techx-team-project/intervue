'use client';

import Spinner from '@/components/common/Spinner';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { getErrorMessage } from '@/utils/error';
import { Award, Briefcase, FileText, FolderGit2, GraduationCap, Wrench } from 'lucide-react';
import { useState } from 'react';
import CandidateAboutSection from './CandidateAboutSection';
import CandidateComingSoonSection from './CandidateComingSoonSection';
import CandidateEditModal from './CandidateEditModal';
import CandidateHeroHeader from './CandidateHeroHeader';
import CandidateJobPreferencesSidebar from './CandidateJobPreferencesSidebar';

export default function CandidateProfileView() {
  const { data: profile, isPending, isError, error, refetch, isRefetching } = useCandidateProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-slate-600">{getErrorMessage(error)}</p>
        <Button type="button" variant="outline" isLoading={isRefetching} onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const openEdit = () => setIsEditOpen(true);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-topcv py-3">
          <Breadcrumb items={[{ label: 'Candidate' }, { label: 'My profile' }]} showHome className="text-xs" />
        </div>
      </div>

      <div className="container-topcv space-y-6 pt-5">
        <CandidateHeroHeader profile={profile} onEdit={openEdit} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <CandidateAboutSection bio={profile.bio} onEdit={openEdit} />
            <CandidateComingSoonSection
              title="Work experience"
              description="Add your work history here soon."
              icon={Briefcase}
            />
            <CandidateComingSoonSection
              title="Education"
              description="Add your schools and degrees here soon."
              icon={GraduationCap}
            />
            <CandidateComingSoonSection title="Skills" description="Showcase your skills here soon." icon={Wrench} />
            <CandidateComingSoonSection
              title="Projects"
              description="Highlight your best projects here soon."
              icon={FolderGit2}
            />
            <CandidateComingSoonSection
              title="Certifications and languages"
              description="List your certificates and languages here soon."
              icon={Award}
            />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <CandidateJobPreferencesSidebar profile={profile} onEdit={openEdit} />
            <CandidateComingSoonSection
              title="Attached CVs"
              description="Upload and manage your CVs here soon."
              icon={FileText}
            />
          </div>
        </div>
      </div>

      <CandidateEditModal profile={profile} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
}
