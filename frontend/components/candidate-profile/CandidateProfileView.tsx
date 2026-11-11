'use client';

import Spinner from '@/components/common/Spinner';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { getErrorMessage } from '@/utils/error';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import CandidateAboutSection from './CandidateAboutSection';
import CandidateCertificationSection from './CandidateCertificationSection';
import CandidateEditModal from './CandidateEditModal';
import CandidateEducationSection from './CandidateEducationSection';
import CandidateExperienceSection from './CandidateExperienceSection';
import CandidateHeroHeader from './CandidateHeroHeader';
import CandidateJobPreferencesSidebar from './CandidateJobPreferencesSidebar';
import CandidateLanguageSection from './CandidateLanguageSection';
import CandidateProjectSection from './CandidateProjectSection';
import CandidateSkillSection from './CandidateSkillSection';
import AiCvProfileModal from './AiCvProfileModal';

export default function CandidateProfileView() {
  const { data: profile, isPending, isError, error, refetch, isRefetching } = useCandidateProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAiCvModalOpen, setIsAiCvModalOpen] = useState(false);

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
        <CandidateHeroHeader profile={profile} onEdit={openEdit} onOpenAiCv={() => setIsAiCvModalOpen(true)} />

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
            <div className="border-primary/20 from-primary/5 rounded-3xl border bg-gradient-to-br via-white to-emerald-50/40 p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-navy text-sm font-bold">Đồng bộ hồ sơ từ CV</h3>
                  <p className="text-on-surface-variant text-xs">Tiết kiệm thời gian với AI</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Tải lên hoặc chọn CV đã có. AI sẽ đọc nội dung, trích xuất kinh nghiệm, kỹ năng và học vấn để cập nhật
                vào hồ sơ của bạn.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={() => setIsAiCvModalOpen(true)}
              >
                Quét CV cập nhật hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CandidateEditModal profile={profile} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <AiCvProfileModal
        isOpen={isAiCvModalOpen}
        onClose={() => setIsAiCvModalOpen(false)}
        onOpenManualEdit={openEdit}
      />
    </div>
  );
}
