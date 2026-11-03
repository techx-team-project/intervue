'use client';

import Input from '@/components/ui/Input';
import NumberStepper from '@/components/ui/NumberStepper';
import Select from '@/components/ui/Select';
import {
  RECRUITER_BUDGET_SOURCE_OPTIONS,
  RECRUITER_LEVEL_OPTIONS,
  RECRUITER_POSITION_OPTIONS,
} from '@/constants/recruiter-onboarding';
import type { RecruiterNeedsFormData } from '@/schemas/recruiter.schema';
import { todayIsoDate } from '@/utils/datetime';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

type HiringNeedFieldsProps = {
  form: UseFormReturn<RecruiterNeedsFormData>;
};

export default function HiringNeedFields({ form }: HiringNeedFieldsProps) {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;
  const continuous = useWatch({ control, name: 'continuous' });

  return (
    <>
      <Select
        id="position"
        label="Which role are you hiring for? *"
        placeholder="Select a role"
        options={RECRUITER_POSITION_OPTIONS}
        error={errors.position?.message}
        {...register('position')}
      />

      <Select
        id="level"
        label="Level *"
        placeholder="Select a level"
        options={RECRUITER_LEVEL_OPTIONS}
        error={errors.level?.message}
        {...register('level')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Input
            id="hireBy"
            type="date"
            label="When do you need to finish hiring? *"
            min={todayIsoDate()}
            disabled={continuous}
            className="disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            error={errors.hireBy?.message}
            {...register('hireBy')}
          />
          <label
            htmlFor="continuous"
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 select-none"
          >
            <input
              id="continuous"
              type="checkbox"
              className="accent-primary h-4 w-4 cursor-pointer"
              {...register('continuous', {
                deps: ['hireBy'],
                onChange: (event) => {
                  if (event.target.checked) {
                    setValue('hireBy', '');
                    clearErrors('hireBy');
                  }
                },
              })}
            />
            <span>Hire continuously</span>
          </label>
        </div>

        <Controller
          control={control}
          name="headcount"
          render={({ field }) => (
            <NumberStepper
              {...field}
              id="headcount"
              label="Number of hires *"
              min={1}
              max={999}
              error={errors.headcount?.message}
            />
          )}
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-slate-800">
          What is your hiring budget for this role?
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id="budgetFrom"
            type="text"
            inputMode="numeric"
            placeholder="From (VND)"
            aria-label="Budget from"
            error={errors.budgetFrom?.message}
            {...register('budgetFrom', { deps: ['budgetTo'] })}
          />
          <Input
            id="budgetTo"
            type="text"
            inputMode="numeric"
            placeholder="To (VND)"
            aria-label="Budget to"
            error={errors.budgetTo?.message}
            {...register('budgetTo', { deps: ['budgetFrom'] })}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-slate-800">Budget source</legend>
        <div className="flex items-center gap-6">
          {RECRUITER_BUDGET_SOURCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              htmlFor={`budgetSource-${option.value}`}
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700"
            >
              <input
                id={`budgetSource-${option.value}`}
                type="radio"
                value={option.value}
                className="accent-primary h-4 w-4 cursor-pointer"
                {...register('budgetSource')}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
