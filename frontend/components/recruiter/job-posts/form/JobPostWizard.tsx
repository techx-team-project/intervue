'use client';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import { isApiError } from '@/lib/api-error';
import { JobPostFormData, jobPostSchema } from '@/schemas/job.schema';
import type { JobStatus } from '@/types/recruiter-job';
import { getErrorMessage } from '@/utils/error';
import { toSaveRequest } from '@/utils/recruiter-job';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save, SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FormProvider, Path, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import JobBasicsStep from './JobBasicsStep';
import JobDemoTools from './JobDemoTools';
import JobContentStep from './JobContentStep';
import JobFormStepper, { JOB_FORM_STEPS } from './JobFormStepper';
import JobReviewStep from './JobReviewStep';

const LAST_STEP = JOB_FORM_STEPS.length - 1;
const LIVE_STATUSES: JobStatus[] = ['PUBLISHED', 'PAUSED'];

const STEP_FIELDS: Array<Array<Path<JobPostFormData>>> = [
  [
    'title',
    'level',
    'contractType',
    'workingArrangement',
    'city',
    'address',
    'salaryMin',
    'salaryMax',
    'skills',
    'deadline',
    'openings',
  ],
  ['description', 'requirements', 'benefits', 'screeningQuestions'],
  [],
];

const SERVER_FIELD_MAP: Record<string, Path<JobPostFormData>> = {
  'location.city': 'city',
  'location.address': 'address',
  'salary.min': 'salaryMin',
  'salary.max': 'salaryMax',
  skillIds: 'skills',
};

function normaliseServerField(field: string): string {
  const mapped = SERVER_FIELD_MAP[field] ?? field;
  return mapped.replace(/\[(\d+)\]/g, '.$1');
}

function stepOfField(field: string): number {
  if (field.startsWith('screeningQuestions')) return 1;
  const index = STEP_FIELDS.findIndex((fields) => fields.includes(field as Path<JobPostFormData>));
  return index === -1 ? 0 : index;
}

interface JobPostWizardProps {
  jobId?: number;
  status?: JobStatus;
  initialValues: JobPostFormData;
}

export default function JobPostWizard({ jobId, status, initialValues }: JobPostWizardProps) {
  const router = useRouter();
  const mutations = useRecruiterJobMutations();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [savedId, setSavedId] = useState(jobId);
  const [busy, setBusy] = useState(false);

  const form = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const isLive = status !== undefined && LIVE_STATUSES.includes(status);

  const goTo = (target: number) => {
    setStep(target);
    setReached((current) => Math.max(current, target));
  };

  const persist = async (): Promise<number> => {
    const data = toSaveRequest(form.getValues());
    if (savedId) {
      await mutations.update.mutateAsync({ id: savedId, data });
      return savedId;
    }
    const created = await mutations.create.mutateAsync(data);
    setSavedId(created.id);
    return created.id;
  };

  const showServerError = (error: unknown) => {
    if (isApiError(error)) {
      const fieldErrors = error.details.filter((detail) => detail.field);
      fieldErrors.forEach((detail) => {
        form.setError(normaliseServerField(detail.field as string) as Path<JobPostFormData>, {
          message: detail.message,
        });
      });
      if (fieldErrors.length > 0) {
        goTo(Math.min(...fieldErrors.map((detail) => stepOfField(normaliseServerField(detail.field as string)))));
      }
    }
    toast.error(getErrorMessage(error));
  };

  const handleNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) goTo(step + 1);
  };

  const handleSaveDraft = async () => {
    if (!(await form.trigger('title'))) {
      setStep(0);
      return;
    }
    setBusy(true);
    try {
      await persist();
      toast.success('Đã lưu bản nháp.');
    } catch (error) {
      showServerError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleValid = async () => {
    setBusy(true);
    try {
      const id = await persist();
      if (!isLive) await mutations.publish.mutateAsync(id);
      toast.success(isLive ? 'Đã cập nhật tin tuyển dụng.' : 'Đã đăng tin tuyển dụng.');
      router.push(ROUTES.RECRUITER_JOBS);
    } catch (error) {
      showServerError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleInvalid = (errors: FieldErrors<JobPostFormData>) => {
    const firstStep = Math.min(...Object.keys(errors).map(stepOfField));
    goTo(firstStep);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleValid, handleInvalid)} className="mx-auto max-w-3xl space-y-5" noValidate>
        {process.env.NODE_ENV !== 'production' && <JobDemoTools />}

        <JobFormStepper current={step} reached={reached} onSelect={setStep} />

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6">
          <h2 className="mb-4 text-base font-bold text-slate-900">{JOB_FORM_STEPS[step]}</h2>
          {step === 0 && <JobBasicsStep />}
          {step === 1 && <JobContentStep />}
          {step === LAST_STEP && <JobReviewStep onEdit={setStep} />}
        </div>

        <div className="sticky bottom-0 -mx-1 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/90 px-1 py-3 backdrop-blur">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0 || busy}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => setStep(step - 1)}
          >
            Quay lại
          </Button>

          <div className="flex items-center gap-2">
            {!isLive && (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSaveDraft}
              >
                Lưu nháp
              </Button>
            )}
            {step < LAST_STEP ? (
              <Button type="button" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={handleNext}>
                Tiếp tục
              </Button>
            ) : (
              <Button type="submit" isLoading={busy} leftIcon={<SendHorizontal className="h-4 w-4" />}>
                {isLive ? 'Lưu thay đổi' : 'Đăng tin'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
