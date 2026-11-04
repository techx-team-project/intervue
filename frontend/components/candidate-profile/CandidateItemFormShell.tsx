'use client';

import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

type CandidateItemFormShellProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isPending: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function CandidateItemFormShell<T extends FieldValues>({
  methods,
  onSubmit,
  isPending,
  onClose,
  children,
}: CandidateItemFormShellProps<T>) {
  const rootMessage = methods.formState.errors.root?.message;

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="space-y-4 text-sm">
        {rootMessage && (
          <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600">
            {rootMessage}
          </p>
        )}

        {children}

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} leftIcon={<Save className="h-4 w-4" />}>
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
