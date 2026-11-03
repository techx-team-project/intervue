'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateEducationSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateEducation } from '@/types/candidate-profile';
import { toEducationFormValues, toEducationRequest } from '@/utils/candidate-sections';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';

export default function CandidateEducationForm({
  item,
  save,
  onClose,
}: CandidateItemFormProps<'educations', CandidateEducation>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateEducationSchema,
    defaultValues: toEducationFormValues(item),
    toRequest: toEducationRequest,
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
      <Input label="School" error={errors.school?.message} {...register('school')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Degree" error={errors.degree?.message} {...register('degree')} />
        <Input label="Major" error={errors.major?.message} {...register('major')} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Start year"
          inputMode="numeric"
          maxLength={4}
          error={errors.startYear?.message}
          {...register('startYear', { onChange: () => void methods.trigger('endYear') })}
        />
        <Input
          label="End year"
          inputMode="numeric"
          maxLength={4}
          helperText="Leave empty if still studying."
          error={errors.endYear?.message}
          {...register('endYear')}
        />
        <Input label="GPA" error={errors.gpa?.message} {...register('gpa')} />
      </div>
      <Textarea
        label="Achievements"
        rows={3}
        placeholder="Honors, scholarships, activities"
        error={errors.achievements?.message}
        {...register('achievements')}
      />
    </CandidateItemFormShell>
  );
}
