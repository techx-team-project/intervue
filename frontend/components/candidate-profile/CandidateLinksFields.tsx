'use client';

import Input from '@/components/ui/Input';
import type { CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import { useFormContext } from 'react-hook-form';
import CandidateFormSection from './CandidateFormSection';

export default function CandidateLinksFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  return (
    <CandidateFormSection title="Links">
      <Input
        label="GitHub"
        placeholder="https://github.com/..."
        error={errors.githubUrl?.message}
        {...register('githubUrl')}
      />
      <Input
        label="LinkedIn"
        placeholder="https://linkedin.com/in/..."
        error={errors.linkedinUrl?.message}
        {...register('linkedinUrl')}
      />
      <Input
        label="Portfolio"
        placeholder="https://..."
        error={errors.portfolioUrl?.message}
        {...register('portfolioUrl')}
      />
    </CandidateFormSection>
  );
}
