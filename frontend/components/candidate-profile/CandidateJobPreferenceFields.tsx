'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  CAREER_LEVEL_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  JOB_SEARCH_STATUS_OPTIONS,
  PROFILE_INDUSTRY_OPTIONS,
  PROFILE_LIST_LIMIT,
  PROFILE_LOCATION_OPTIONS,
  WORK_MODE_OPTIONS,
} from '@/constants/candidate-profile';
import type { CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import CandidateChipSelect from './CandidateChipSelect';
import CandidateFormSection from './CandidateFormSection';
import CandidateSwitchRow from './CandidateSwitchRow';

const NOT_SPECIFIED = { value: '', label: 'Not specified' };

export default function CandidateJobPreferenceFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();
  const salaryNegotiable = useWatch({ control, name: 'salaryNegotiable' });

  return (
    <CandidateFormSection title="Job preferences">
      <Select
        label="Job search status"
        options={JOB_SEARCH_STATUS_OPTIONS}
        error={errors.jobSearchStatus?.message}
        {...register('jobSearchStatus')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Desired role" error={errors.desiredRole?.message} {...register('desiredRole')} />
        <Select
          label="Career level"
          options={[NOT_SPECIFIED, ...CAREER_LEVEL_OPTIONS]}
          error={errors.desiredLevel?.message}
          {...register('desiredLevel')}
        />
      </div>

      <Controller
        control={control}
        name="salaryNegotiable"
        render={({ field }) => (
          <CandidateSwitchRow
            title="Negotiable salary"
            description="Hide the salary range and show it as negotiable."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Minimum salary (VND)"
          inputMode="numeric"
          disabled={salaryNegotiable}
          error={errors.salaryMin?.message}
          {...register('salaryMin')}
        />
        <Input
          label="Maximum salary (VND)"
          inputMode="numeric"
          disabled={salaryNegotiable}
          error={errors.salaryMax?.message}
          {...register('salaryMax')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Work mode"
          options={[NOT_SPECIFIED, ...WORK_MODE_OPTIONS]}
          error={errors.workMode?.message}
          {...register('workMode')}
        />
        <Select
          label="Contract type"
          options={[NOT_SPECIFIED, ...CONTRACT_TYPE_OPTIONS]}
          error={errors.contractType?.message}
          {...register('contractType')}
        />
      </div>

      <Controller
        control={control}
        name="preferredLocations"
        render={({ field }) => (
          <CandidateChipSelect
            label="Preferred locations"
            options={PROFILE_LOCATION_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            max={PROFILE_LIST_LIMIT}
            error={errors.preferredLocations?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="preferredIndustries"
        render={({ field }) => (
          <CandidateChipSelect
            label="Industries of interest"
            options={PROFILE_INDUSTRY_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            max={PROFILE_LIST_LIMIT}
            error={errors.preferredIndustries?.message}
          />
        )}
      />
    </CandidateFormSection>
  );
}
