'use client';

import type { SaveItemMutation } from '@/hooks/useCandidateSection';
import type { CandidateSection, CandidateSectionRequests } from '@/types/candidate-profile';
import { aliasProfileErrorFields } from '@/utils/candidate-profile';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type DefaultValues, type FieldValues, type Path } from 'react-hook-form';
import type { z } from 'zod';

type Options<S extends CandidateSection, T extends FieldValues> = {
  schema: z.ZodType<T, T>;
  defaultValues: T;
  toRequest: (values: T) => CandidateSectionRequests[S];
  id?: number;
  save: SaveItemMutation<S>;
  onClose: () => void;
};

export function useCandidateItemForm<S extends CandidateSection, T extends FieldValues>({
  schema,
  defaultValues,
  toRequest,
  id,
  save,
  onClose,
}: Options<S, T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const fields = Object.keys(defaultValues) as Path<T>[];

  const onSubmit = methods.handleSubmit((values) =>
    save.mutate(
      { id, body: toRequest(values) },
      {
        onSuccess: onClose,
        onError: (error) => applyFormError(aliasProfileErrorFields(error), methods.setError, fields),
      },
    ),
  );

  return { methods, onSubmit };
}
