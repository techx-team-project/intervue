'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { SECTION_TAG_LIMIT } from '@/constants/candidate-profile';
import { SKILL_SUGGESTIONS } from '@/constants/candidate-skills';
import { useCandidateItemForm } from '@/hooks/useCandidateItemForm';
import { candidateProjectSchema } from '@/schemas/candidate-sections.schema';
import type { CandidateProject } from '@/types/candidate-profile';
import { toProjectFormValues, toProjectRequest } from '@/utils/candidate-sections';
import { Controller } from 'react-hook-form';
import CandidateDateRangeFields from './CandidateDateRangeFields';
import CandidateItemFormShell from './CandidateItemFormShell';
import type { CandidateItemFormProps } from './CandidateSectionManager';
import CandidateTagInput from './CandidateTagInput';

export default function CandidateProjectForm({
  item,
  save,
  onClose,
}: CandidateItemFormProps<'projects', CandidateProject>) {
  const { methods, onSubmit } = useCandidateItemForm({
    schema: candidateProjectSchema,
    defaultValues: toProjectFormValues(item),
    toRequest: toProjectRequest,
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
        <Input label="Project name" error={errors.name?.message} {...register('name')} />
        <Input label="Your role" error={errors.role?.message} {...register('role')} />
      </div>
      <CandidateDateRangeFields currentLabel="This project is ongoing" />
      <Textarea
        label="Description"
        rows={4}
        placeholder="What does the project do?"
        error={errors.description?.message}
        {...register('description')}
      />
      <Textarea
        label="Highlights"
        rows={3}
        placeholder="What are you proud of?"
        error={errors.highlights?.message}
        {...register('highlights')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="GitHub link"
          placeholder="https://github.com/..."
          error={errors.githubUrl?.message}
          {...register('githubUrl')}
        />
        <Input label="Demo link" placeholder="https://..." error={errors.demoUrl?.message} {...register('demoUrl')} />
      </div>
      <Controller
        control={control}
        name="technologies"
        render={({ field }) => (
          <CandidateTagInput
            label="Technologies"
            value={field.value}
            inputRef={field.ref}
            onChange={field.onChange}
            suggestions={SKILL_SUGGESTIONS}
            max={SECTION_TAG_LIMIT}
            placeholder="Type a technology and press Enter"
            error={errors.technologies?.message}
          />
        )}
      />
    </CandidateItemFormShell>
  );
}
