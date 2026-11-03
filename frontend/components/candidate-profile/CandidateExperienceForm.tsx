'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { SECTION_TAG_LIMIT } from '@/constants/candidate-profile';
import { SKILL_SUGGESTIONS } from '@/constants/candidate-skills';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateExperienceSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateExperience } from '@/types/candidate-profile';
import { toExperienceFormValues, toExperienceRequest } from '@/utils/candidate-sections';
import { Controller } from 'react-hook-form';
import CandidateDateRangeFields from './CandidateDateRangeFields';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';
import CandidateTagInput from './CandidateTagInput';

export default function CandidateExperienceForm({
  item,
  save,
  onClose,
}: CandidateItemFormProps<'experiences', CandidateExperience>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateExperienceSchema,
    defaultValues: toExperienceFormValues(item),
    toRequest: toExperienceRequest,
    id: item?.id,
    save,
    onClose,
  });
  const {
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <CandidateItemFormShell methods={methods} onSubmit={onSubmit} isPending={save.isPending} onClose={onClose}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Job title" error={errors.title?.message} {...register('title')} />
        <Input label="Company" error={errors.companyName?.message} {...register('companyName')} />
      </div>
      <Input label="Location" error={errors.location?.message} {...register('location')} />
      <CandidateDateRangeFields currentLabel="I currently work here" />
      <Textarea
        label="Description"
        rows={4}
        placeholder="Describe your responsibilities"
        error={errors.description?.message}
        {...register('description')}
      />
      <Textarea
        label="Achievements"
        rows={3}
        placeholder="Key results you delivered"
        error={errors.achievements?.message}
        {...register('achievements')}
      />
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <CandidateTagInput
            label="Skills used"
            value={field.value}
            inputRef={field.ref}
            onChange={field.onChange}
            suggestions={SKILL_SUGGESTIONS}
            max={SECTION_TAG_LIMIT}
            placeholder="Type a skill and press Enter"
            error={errors.skills?.message}
          />
        )}
      />
    </CandidateItemFormShell>
  );
}
