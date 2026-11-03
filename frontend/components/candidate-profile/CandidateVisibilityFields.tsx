'use client';

import type { CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import { Controller, useFormContext } from 'react-hook-form';
import CandidateFormSection from './CandidateFormSection';
import CandidateSwitchRow from './CandidateSwitchRow';

export default function CandidateVisibilityFields() {
  const { control } = useFormContext<CandidateProfileFormData>();

  return (
    <CandidateFormSection title="Visibility">
      <Controller
        control={control}
        name="showPersonalDetails"
        render={({ field }) => (
          <CandidateSwitchRow
            title="Show birth year and gender to recruiters"
            description="Recruiters can see these details on your profile."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="searchableByRecruiters"
        render={({ field }) => (
          <CandidateSwitchRow
            title="Allow recruiters to find my profile"
            description="Your profile can appear in recruiter searches."
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </CandidateFormSection>
  );
}
