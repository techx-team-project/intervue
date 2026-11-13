'use client';

import { SECTION_MIN_YEAR } from '@/constants/candidate-profile';
import Input from '@/components/ui/Input';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateCertificationSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateCertification } from '@/types/candidate-profile';
import { toCertificationFormValues, toCertificationRequest } from '@/utils/candidate-sections';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';

export default function CandidateCertificationForm({
  item,
  save,
  onClose,
}: CandidateItemFormProps<'certifications', CandidateCertification>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateCertificationSchema,
    defaultValues: toCertificationFormValues(item),
    toRequest: toCertificationRequest,
    id: item?.id,
    save,
    onClose,
  });
  const {
    register,
    formState: { errors },
  } = methods;

  return (
    <CandidateItemFormShell methods={methods} onSubmit={onSubmit} isPending={save.isPending} onClose={onClose}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Certificate name" error={errors.name?.message} {...register('name')} />
        <Input label="Issuing organization" error={errors.issuer?.message} {...register('issuer')} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Issue date"
          type="month"
          min={`${SECTION_MIN_YEAR}-01`}
          max={new Date().toISOString().slice(0, 7)}
          placeholder="YYYY-MM"
          error={errors.issueDate?.message}
          {...register('issueDate')}
        />
        <Input label="Credential ID" error={errors.credentialId?.message} {...register('credentialId')} />
      </div>
      <Input
        label="Credential link"
        placeholder="https://..."
        error={errors.credentialUrl?.message}
        {...register('credentialUrl')}
      />
    </CandidateItemFormShell>
  );
}
