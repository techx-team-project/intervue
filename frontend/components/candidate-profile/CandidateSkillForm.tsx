'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS } from '@/constants/candidate-profile';
import { SKILL_SUGGESTIONS } from '@/constants/candidate-skills';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateSkillSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateSkill } from '@/types/candidate-profile';
import { toSkillFormValues, toSkillRequest } from '@/utils/candidate-sections';
import { useController } from 'react-hook-form';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';
import CandidateSuggestInput from './CandidateSuggestInput';

export default function CandidateSkillForm({ item, save, onClose }: CandidateItemFormProps<'skills', CandidateSkill>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateSkillSchema,
    defaultValues: toSkillFormValues(item),
    toRequest: toSkillRequest,
    id: item?.id,
    save,
    onClose,
  });
  const {
    register,
    formState: { errors },
  } = methods;
  const { field: nameField } = useController({ control: methods.control, name: 'name' });

  return (
    <CandidateItemFormShell methods={methods} onSubmit={onSubmit} isPending={save.isPending} onClose={onClose}>
      <CandidateSuggestInput
        label="Skill name"
        value={nameField.value ?? ''}
        onChange={nameField.onChange}
        onBlur={nameField.onBlur}
        inputRef={nameField.ref}
        suggestions={SKILL_SUGGESTIONS}
        placeholder="e.g. React"
        error={errors.name?.message}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Category"
          options={SKILL_CATEGORY_OPTIONS}
          error={errors.category?.message}
          {...register('category')}
        />
        <Select label="Level" options={SKILL_LEVEL_OPTIONS} error={errors.level?.message} {...register('level')} />
        <Input
          label="Years of experience"
          inputMode="numeric"
          maxLength={2}
          error={errors.years?.message}
          {...register('years')}
        />
      </div>
    </CandidateItemFormShell>
  );
}
