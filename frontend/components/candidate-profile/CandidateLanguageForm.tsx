'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { LANGUAGE_PROFICIENCY_OPTIONS } from '@/constants/candidate-profile';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateLanguageSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateLanguage } from '@/types/candidate-profile';
import { toLanguageFormValues, toLanguageRequest } from '@/utils/candidate-sections';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';

export default function CandidateLanguageForm({
  item,
  save,
  onClose,
}: CandidateItemFormProps<'languages', CandidateLanguage>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateLanguageSchema,
    defaultValues: toLanguageFormValues(item),
    toRequest: toLanguageRequest,
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
        <Input label="Language" placeholder="e.g. English" error={errors.language?.message} {...register('language')} />
        <Select
          label="Proficiency"
          options={LANGUAGE_PROFICIENCY_OPTIONS}
          error={errors.proficiency?.message}
          {...register('proficiency')}
        />
      </div>
      <Input
        label="Certificate"
        placeholder="e.g. IELTS 7.0"
        error={errors.certificate?.message}
        {...register('certificate')}
      />
    </CandidateItemFormShell>
  );
}
