'use client';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { jobPostSchema, JobPostFormData } from '@/schemas/job.schema';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Save, SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
    <div className="space-y-5 pb-24">
      <JobBasicInfoSection form={form} />
      <JobCompensationSection form={form} />
      <JobDescriptionSection
        form={form}
        isAiGenerated={isAiGenerated}
        onAiContentApplied={() => setIsAiGenerated(true)}
      />
      <JobScreeningQuestionsSection form={form} />

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[#e2e8f0] bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => setIsPreviewing(true)}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant="secondary"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSaveDraft}
          >
            Save draft
          </Button>
          <Button
            type="button"
            isLoading={isSaving}
            leftIcon={<SendHorizontal className="h-4 w-4" />}
            onClick={handleSubmitForReview}
          >
            {mode === 'create' ? 'Submit for review' : 'Update & submit for review'}
          </Button>
        </div>
      </div>

      {isPreviewing && (
        <JobPostPreviewModal job={toPreviewJob(form.getValues(), initialData)} onClose={() => setIsPreviewing(false)} />
      )}
    </div>
  );
}
