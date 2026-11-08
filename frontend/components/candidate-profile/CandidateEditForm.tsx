'use client';

import Button from '@/components/ui/Button';
import type { useUpdateCandidateProfile } from '@/hooks/useCandidateProfile';
import { candidateProfileSchema, type CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { aliasProfileErrorFields, toFormValues, toRequest } from '@/utils/candidate-profile';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import CandidateJobPreferenceFields from './CandidateJobPreferenceFields';
import CandidateLinksFields from './CandidateLinksFields';
import CandidatePersonalFields from './CandidatePersonalFields';
import CandidateVisibilityFields from './CandidateVisibilityFields';

type CandidateEditFormProps = {
  profile: CandidateProfileResponse;
  update: ReturnType<typeof useUpdateCandidateProfile>;
  onClose: () => void;
};

const FORM_FIELDS = Object.keys(candidateProfileSchema.shape) as (keyof CandidateProfileFormData)[];

export default function CandidateEditForm({ profile, update, onClose }: CandidateEditFormProps) {
  const methods = useForm<CandidateProfileFormData>({
    resolver: zodResolver(candidateProfileSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(profile),
  });
  const { handleSubmit, setError, formState } = methods;

  const onSubmit = handleSubmit((values) =>
    update.mutate(toRequest(values), {
      onSuccess: onClose,
      onError: (error) => applyFormError(aliasProfileErrorFields(error), setError, FORM_FIELDS),
    }),
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="space-y-6 text-sm">
        {formState.errors.root?.message && (
          <p role="alert" className="bg-error/10 text-error rounded-xl px-3.5 py-2.5 text-xs font-medium">
            {formState.errors.root.message}
          </p>
        )}

        <CandidatePersonalFields profile={profile} />
        <CandidateLinksFields />
        <CandidateJobPreferenceFields />
        <CandidateVisibilityFields />

        <div className="border-outline-variant flex items-center justify-end gap-3 border-t pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={update.isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={update.isPending} leftIcon={<Save className="h-4 w-4" />}>
            Save changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
