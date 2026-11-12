'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useRecruiterJobMutations, useSimilarJobs } from '@/hooks/useRecruiterJobs';
import { isApiError } from '@/lib/api-error';
import { JobPostFormData, jobPostSchema } from '@/schemas/job.schema';
import type { JobStatus } from '@/types/recruiter-job';
import { getErrorMessage } from '@/utils/error';
import { toSaveRequest } from '@/utils/recruiter-job';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowLeft, ArrowRight, Save, SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FormProvider, Path, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import JobBasicsStep from './JobBasicsStep';
import JobDemoTools from './JobDemoTools';
import JobContentStep from './JobContentStep';
import JobFormSidebar from './JobFormSidebar';
import JobFormStepper, { JOB_FORM_STEPS } from './JobFormStepper';
import JobReviewStep from './JobReviewStep';

const LAST_STEP = JOB_FORM_STEPS.length - 1;
const LIVE_STATUSES: JobStatus[] = ['PUBLISHED', 'PAUSED'];

const STEP_FIELDS: Array<Array<Path<JobPostFormData>>> = [
  [
    'title',
    'level',
    'jobRole',
    'contractType',
    'workingArrangement',
    'city',
    'address',
    'salaryMin',
    'salaryMax',
    'experienceMinYears',
    'experienceMaxYears',
    'skills',
    'deadline',
    'openings',
  ],
  ['description', 'requirements', 'benefits', 'benefitTags', 'hiringSteps', 'screeningQuestions'],
  [],
];

const SERVER_FIELD_MAP: Record<string, Path<JobPostFormData>> = {
  'location.city': 'city',
  'location.address': 'address',
  'salary.min': 'salaryMin',
  'salary.max': 'salaryMax',
  'salary.basis': 'salaryBasis',
  'experience.minYears': 'experienceMinYears',
  'experience.maxYears': 'experienceMaxYears',
  skillIds: 'skills',
};

function normaliseServerField(field: string): string {
  const mapped = SERVER_FIELD_MAP[field] ?? field;
  return mapped.replace(/\[(\d+)\]/g, '.$1').replace(/^(hiringSteps\.\d+)$/, '$1.title');
}

function stepOfField(field: string): number {
  if (field.startsWith('screeningQuestions') || field.startsWith('hiringSteps') || field.startsWith('benefitTags'))
    return 1;
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const isLive = status !== undefined && LIVE_STATUSES.includes(status);
  const similarJobs = useSimilarJobs(form.getValues('title'), form.getValues('city'), savedId, confirmOpen).data;

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
      toast.success('Draft saved.');
    } catch (error) {
      showServerError(error);
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setBusy(true);
    try {
      const id = await persist();
      const result = isLive ? null : await mutations.publish.mutateAsync(id);
      toast.success(
        isLive
          ? 'Job post updated.'
          : result?.status === 'PENDING_REVIEW'
            ? 'Job post submitted. It goes live once an admin approves it.'
            : 'Job post published.',
      );
      router.push(ROUTES.RECRUITER_JOBS);
    } catch (error) {
      showServerError(error);
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  // Only the review step publishes, and only after the confirmation dialog
  const handleValid = () => {
    if (step !== LAST_STEP) return;
    if (isLive) void publish();
    else setConfirmOpen(true);
  };

  const handleInvalid = (errors: FieldErrors<JobPostFormData>) => {
    const firstStep = Math.min(...Object.keys(errors).map(stepOfField));
    goTo(firstStep);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleValid, handleInvalid)} className="mx-auto max-w-6xl" noValidate>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 space-y-5">
            {process.env.NODE_ENV !== 'production' && <JobDemoTools />}

            <JobFormStepper current={step} reached={reached} onSelect={setStep} />

            {step === 0 && <JobBasicsStep />}
            {step === 1 && <JobContentStep />}
            {step === LAST_STEP && <JobReviewStep onEdit={setStep} />}

            <div className="border-outline-variant sticky bottom-0 -mx-1 flex items-center justify-between gap-3 border-t bg-white/90 px-1 py-3 backdrop-blur">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 0 || busy}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => setStep(step - 1)}
              >
                Back
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
                    Save draft
                  </Button>
                )}
                {/* Distinct keys stop the click that reaches the last step from also submitting the form */}
                {step < LAST_STEP ? (
                  <Button key="next" type="button" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button key="submit" type="submit" isLoading={busy} leftIcon={<SendHorizontal className="h-4 w-4" />}>
                    {isLive ? 'Save changes' : 'Publish'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <JobFormSidebar />
          </div>
        </div>
      </form>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Post this job?"
        description="The post will be visible to candidates immediately after publishing."
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" disabled={busy} onClick={() => setConfirmOpen(false)}>
              Review
            </Button>
            <Button isLoading={busy} onClick={publish}>
              Publish
            </Button>
          </div>
        }
      >
        <p className="text-on-surface-variant text-sm">You can still edit or close the post after publishing.</p>
        {similarJobs && similarJobs.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">Your company already has a similar live job in this city:</p>
              <ul className="mt-1 list-disc pl-4">
                {similarJobs.map((job) => (
                  <li key={job.id}>{job.title}</li>
                ))}
              </ul>
              <p className="mt-1">Publish only if this is a separate opening.</p>
            </div>
          </div>
        )}
      </Modal>
    </FormProvider>
  );
}
