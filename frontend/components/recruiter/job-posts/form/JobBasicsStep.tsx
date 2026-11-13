'use client';

import JobLocationPicker from '@/components/map/JobLocationPicker';
import { Input } from '@/components/ui/Input';
import ListboxSelect from '@/components/ui/ListboxSelect';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import {
  JOB_CITY_OPTIONS,
  JOB_FORM_ARRANGEMENT_OPTIONS,
  JOB_FORM_CONTRACT_OPTIONS,
  JOB_FORM_CURRENCY_OPTIONS,
  JOB_FORM_LEVEL_OPTIONS,
  JOB_FORM_ROLE_OPTIONS,
  JOB_FORM_SALARY_BASIS_OPTIONS,
} from '@/constants/recruiter-job';
import {
  JOB_MAX_DEADLINE_DAYS,
  JOB_MAX_EXPERIENCE_YEARS,
  JOB_MAX_SALARY,
  JOB_MIN_SALARY,
  type JobPostFormData,
} from '@/schemas/job.schema';
import { cn } from '@/lib/utils';
import { isoDateAfterDays, todayIsoDate } from '@/utils/datetime';
import { blockInvalidDecimalKeys, blockInvalidIntegerKeys } from '@/utils/number-input';
import { Controller, useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import SkillPicker from './SkillPicker';

function numberOrUndefined(raw: string): number | undefined {
  return raw === '' ? undefined : Number(raw);
}

export default function JobBasicsStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const [city, address, latitude, longitude] = watch(['city', 'address', 'latitude', 'longitude']);
  const negotiable = watch('salaryNegotiable');
  const currency = watch('currency');
  const salaryError = errors.salaryMax?.message ?? errors.salaryMin?.message;
  const experienceError = errors.experienceMinYears?.message ?? errors.experienceMaxYears?.message;

  return (
    <div className="space-y-5">
      <FormSection title="General information" description="What candidates see first in the job list.">
        <Input
          label="Job title"
          placeholder="e.g. Backend Engineer (Java / Spring Boot)"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Job role"
            placeholder="Select a job role"
            options={JOB_FORM_ROLE_OPTIONS}
            error={errors.jobRole?.message}
            {...register('jobRole', { setValueAs: (value: string) => (value === '' ? undefined : value) })}
          />
          <Select label="Level" options={JOB_FORM_LEVEL_OPTIONS} error={errors.level?.message} {...register('level')} />
          <Select
            label="Contract type"
            options={JOB_FORM_CONTRACT_OPTIONS}
            error={errors.contractType?.message}
            {...register('contractType')}
          />
          <Select
            label="Working arrangement"
            options={JOB_FORM_ARRANGEMENT_OPTIONS}
            error={errors.workingArrangement?.message}
            {...register('workingArrangement')}
          />
        </div>
      </FormSection>

      <FormSection title="Work location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="text-on-surface block text-sm font-semibold">Location</span>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <ListboxSelect
                  ariaLabel="Location"
                  placeholder="Select a province / city"
                  searchable
                  searchPlaceholder="Search province or city"
                  value={field.value}
                  onChange={field.onChange}
                  options={JOB_CITY_OPTIONS}
                  className={cn(
                    'h-11 rounded-xl border bg-white px-3.5',
                    errors.city ? 'border-error' : 'border-outline-variant',
                  )}
                  triggerClassName="text-sm"
                />
              )}
            />
            {errors.city && <p className="text-xs font-medium text-rose-500">{errors.city.message}</p>}
          </div>
          <Input
            label="Street address (optional)"
            placeholder="Street, district / branch"
            error={errors.address?.message}
            {...register('address')}
          />
        </div>

        <JobLocationPicker
          latitude={latitude}
          longitude={longitude}
          addressQuery={[address, city].filter(Boolean).join(', ')}
          onChange={(point) => {
            setValue('latitude', point?.lat, { shouldDirty: true });
            setValue('longitude', point?.lng, { shouldDirty: true });
          }}
        />
      </FormSection>

      <FormSection title="Salary & experience">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-on-surface block text-sm font-semibold">Salary (per month)</span>
            <Controller
              control={control}
              name="salaryNegotiable"
              render={({ field }) => (
                <label className="text-on-surface-variant flex cursor-pointer items-center gap-2 text-xs font-medium">
                  Negotiable
                  <Switch size="sm" ariaLabel="Negotiable salary" checked={field.value} onChange={field.onChange} />
                </label>
              )}
            />
          </div>

          {!negotiable && (
            <>
              <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  min={JOB_MIN_SALARY[currency]}
                  max={JOB_MAX_SALARY[currency]}
                  step={currency === 'VND' ? 0.5 : 100}
                  onKeyDown={blockInvalidDecimalKeys}
                  placeholder="From"
                  aria-label="Minimum salary"
                  {...register('salaryMin', { setValueAs: numberOrUndefined })}
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  min={JOB_MIN_SALARY[currency]}
                  max={JOB_MAX_SALARY[currency]}
                  step={currency === 'VND' ? 0.5 : 100}
                  onKeyDown={blockInvalidDecimalKeys}
                  placeholder="To"
                  aria-label="Maximum salary"
                  {...register('salaryMax', { setValueAs: numberOrUndefined })}
                />
                <Select
                  aria-label="Salary currency"
                  options={JOB_FORM_CURRENCY_OPTIONS}
                  className="min-w-28"
                  {...register('currency')}
                />
              </div>

              <div role="radiogroup" aria-label="Salary type" className="flex flex-wrap gap-2">
                {JOB_FORM_SALARY_BASIS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="border-outline-variant text-on-surface-variant text-body-sm has-[:checked]:border-primary has-[:checked]:bg-primary-light has-[:checked]:text-primary-deep has-[:focus-visible]:ring-primary/30 inline-flex h-9 cursor-pointer items-center rounded-lg border bg-white px-3 font-medium transition-colors has-[:focus-visible]:ring-2"
                  >
                    <input type="radio" value={option.value} className="sr-only" {...register('salaryBasis')} />
                    {option.label}
                  </label>
                ))}
              </div>
            </>
          )}
          {salaryError && !negotiable && <p className="text-xs font-medium text-rose-500">{salaryError}</p>}
        </div>

        <div className="space-y-1.5">
          <span className="text-on-surface block text-sm font-semibold">Required experience (years, optional)</span>
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={JOB_MAX_EXPERIENCE_YEARS}
              step={1}
              onKeyDown={blockInvalidIntegerKeys}
              placeholder="From"
              aria-label="Minimum years of experience"
              {...register('experienceMinYears', { setValueAs: numberOrUndefined })}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={JOB_MAX_EXPERIENCE_YEARS}
              step={1}
              onKeyDown={blockInvalidIntegerKeys}
              placeholder="To"
              aria-label="Maximum years of experience"
              {...register('experienceMaxYears', { setValueAs: numberOrUndefined })}
            />
          </div>
          {experienceError && <p className="text-xs font-medium text-rose-500">{experienceError}</p>}
        </div>
      </FormSection>

      <FormSection title="Skills & hiring">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <SkillPicker value={field.value} onChange={field.onChange} error={errors.skills?.message} />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="date"
            label="Application deadline"
            min={todayIsoDate()}
            max={isoDateAfterDays(JOB_MAX_DEADLINE_DAYS)}
            error={errors.deadline?.message}
            {...register('deadline')}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            step={1}
            onKeyDown={blockInvalidIntegerKeys}
            label="Number of openings"
            error={errors.openings?.message}
            {...register('openings', { valueAsNumber: true })}
          />
        </div>
      </FormSection>
    </div>
  );
}
