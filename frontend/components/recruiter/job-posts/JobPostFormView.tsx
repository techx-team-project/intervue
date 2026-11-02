'use client';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { JobPostFormData, jobPostSchema } from '@/schemas/job.schema';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Save, SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import JobAiAssistantModal from './JobAiAssistantModal';
import JobPostFormSidebar from './JobPostFormSidebar';
import JobPostPreviewModal from './JobPostPreviewModal';
import JobBasicInfoSection from './sections/JobBasicInfoSection';
import JobCompensationSection from './sections/JobCompensationSection';
import JobDescriptionSection from './sections/JobDescriptionSection';
import JobScreeningQuestionsSection from './sections/JobScreeningQuestionsSection';

interface JobPostFormViewProps {
  mode: 'create' | 'edit';
  initialData?: RecruiterJobPost;
}

function toFormDefaults(job?: RecruiterJobPost): JobPostFormData {
  return {
    title: job?.title ?? '',
    level: job?.level ?? 'JUNIOR',
    contractType: job?.contractType ?? 'FULL_TIME',
    workingArrangement: job?.workingArrangement ?? 'HYBRID',
    location: job?.location ?? { city: '', district: '', specificAddress: '' },
    salary: job?.salary ?? { negotiable: false, min: undefined, max: undefined, currency: 'VND', period: 'MONTHLY' },
    skills: job?.skills ?? [],
    description: job?.description ?? '',
    requirements: job?.requirements ?? '',
    benefits: job?.benefits ?? '',
    screeningQuestions: job?.screeningQuestions ?? [],
  };
}

function toPreviewJob(values: JobPostFormData, source?: RecruiterJobPost): RecruiterJobPost {
  const now = new Date().toISOString();
  return {
    id: source?.id ?? 'preview',
    title: values.title,
    status: source?.status ?? 'DRAFT',
    level: values.level,
    contractType: values.contractType,
    workingArrangement: values.workingArrangement,
    location: values.location,
    salary: values.salary,
    skills: values.skills,
    description: values.description,
    requirements: values.requirements,
    benefits: values.benefits,
    screeningQuestions: values.screeningQuestions,
    recruitsCount: source?.recruitsCount ?? 1,
    createdAt: source?.createdAt ?? now,
    updatedAt: now,
  };
}

export default function JobPostFormView({ mode, initialData }: JobPostFormViewProps) {
  const router = useRouter();
  const [isAiGenerated, setIsAiGenerated] = useState(Boolean(initialData?.aiGenerated?.description));
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    mode: 'onTouched',
    defaultValues: toFormDefaults(initialData),
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success('Job post saved as a draft.');
    setIsSaving(false);
    router.push(ROUTES.RECRUITER_JOBS);
  };

  const handleSubmitForReview = form.handleSubmit(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success('Job post submitted for review.');
    setIsSaving(false);
    router.push(ROUTES.RECRUITER_JOBS);
  });

  return (
    <div className="pb-24">
      {/* Responsive 2-column split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8 xl:grid-cols-[1fr_360px]">
        {/* Main Column (68% - Form Sections) */}
        <div className="space-y-6">
          <JobBasicInfoSection form={form} />
          <JobCompensationSection form={form} />
          <JobDescriptionSection
            form={form}
            isAiGenerated={isAiGenerated}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onAiContentApplied={() => setIsAiGenerated(true)}
          />
          <JobScreeningQuestionsSection form={form} />
        </div>

        {/* Sticky Sidebar Assistant (32% - Desktop) */}
        <div className="hidden lg:sticky lg:top-20 lg:block">
          <JobPostFormSidebar
            form={form}
            mode={mode}
            isSaving={isSaving}
            onPreview={() => setIsPreviewing(true)}
            onSaveDraft={handleSaveDraft}
            onSubmitForReview={handleSubmitForReview}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile (< lg) */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => setIsPreviewing(true)}
          >
            Preview
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isSaving}
            className="flex-1"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSaveDraft}
          >
            Draft
          </Button>

          <Button
            type="button"
            size="sm"
            isLoading={isSaving}
            className="flex-1"
            leftIcon={<SendHorizontal className="h-4 w-4" />}
            onClick={handleSubmitForReview}
          >
            {mode === 'create' ? 'Submit' : 'Update'}
          </Button>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {isAiAssistantOpen && (
        <JobAiAssistantModal
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          form={form}
          onApplied={() => setIsAiGenerated(true)}
        />
      )}

      {/* Candidate View Preview Modal */}
      {isPreviewing && (
        <JobPostPreviewModal job={toPreviewJob(form.getValues(), initialData)} onClose={() => setIsPreviewing(false)} />
      )}
    </div>
  );
}
