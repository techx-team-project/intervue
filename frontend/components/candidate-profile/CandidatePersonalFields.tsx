'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { GENDER_OPTIONS } from '@/constants/candidate-profile';
import type { CandidateProfileFormData } from '@/schemas/candidate-profile.schema';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { useFormContext } from 'react-hook-form';
import CandidateFormSection from './CandidateFormSection';

type CandidatePersonalFieldsProps = {
  profile: CandidateProfileResponse;
};

const NOT_SPECIFIED = { value: '', label: 'Not specified' };

export default function CandidatePersonalFields({ profile }: CandidatePersonalFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  return (
    <>
      <CandidateFormSection title="Personal details">
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Headline"
          placeholder="e.g. Backend developer"
          error={errors.headline?.message}
          {...register('headline')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone number"
            value={profile.phone ?? ''}
            placeholder="No phone number"
            readOnly
            disabled
            helperText={profile.phone ? 'Phone numbers are changed in your account settings.' : undefined}
          />
          <Input
            label="Contact email"
            type="email"
            placeholder={profile.email}
            helperText="Leave empty to use your login email."
            error={errors.contactEmail?.message}
            {...register('contactEmail')}
          />
        </div>
        <Input label="Address" autoComplete="street-address" error={errors.address?.message} {...register('address')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Gender"
            options={[NOT_SPECIFIED, ...GENDER_OPTIONS]}
            error={errors.gender?.message}
            {...register('gender')}
          />
          <Input
            label="Birth year"
            inputMode="numeric"
            maxLength={4}
            error={errors.birthYear?.message}
            {...register('birthYear')}
          />
        </div>
      </CandidateFormSection>

      <CandidateFormSection title="About me">
        <Textarea
          label="Summary"
          rows={4}
          placeholder="Tell recruiters about your background and goals"
          error={errors.bio?.message}
          {...register('bio')}
        />
      </CandidateFormSection>
    </>
  );
}
