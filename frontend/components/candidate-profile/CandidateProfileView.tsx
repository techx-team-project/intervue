'use client';

import Spinner from '@/components/common/Spinner';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { getErrorMessage } from '@/utils/error';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import CandidateAboutSection from './CandidateAboutSection';
import CandidateCertificationSection from './CandidateCertificationSection';
import CandidateComingSoonSection from './CandidateComingSoonSection';
import CandidateEditModal from './CandidateEditModal';
import CandidateEducationSection from './CandidateEducationSection';
import CandidateExperienceSection from './CandidateExperienceSection';
import CandidateHeroHeader from './CandidateHeroHeader';
import CandidateJobPreferencesSidebar from './CandidateJobPreferencesSidebar';
import CandidateLanguageSection from './CandidateLanguageSection';
import CandidateProjectSection from './CandidateProjectSection';
import CandidateSkillSection from './CandidateSkillSection';

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
        <p className="text-on-surface-variant text-sm">{getErrorMessage(error)}</p>
        <Button type="button" variant="outline" isLoading={isRefetching} onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const openEdit = () => setIsEditOpen(true);

  return (
    <div className="bg-surface-container-low min-h-screen pb-20">
      <div className="border-outline-variant border-b bg-white">
        <div className="container-page py-3">
          <Breadcrumb items={[{ label: 'Candidate' }, { label: 'My profile' }]} showHome className="text-xs" />
        </div>
      </div>

      <div className="container-page space-y-6 pt-5">
        <CandidateHeroHeader profile={profile} onEdit={openEdit} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <CandidateAboutSection bio={profile.bio} onEdit={openEdit} />
            <CandidateExperienceSection items={profile.experiences} />
            <CandidateEducationSection items={profile.educations} />
            <CandidateSkillSection items={profile.skills} />
            <CandidateProjectSection items={profile.projects} />
            <CandidateCertificationSection items={profile.certifications} />
            <CandidateLanguageSection items={profile.languages} />
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
