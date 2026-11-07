'use client';

import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import Button from '@/components/ui/Button';
import { recruiterProfileSchema, type RecruiterProfileFormData } from '@/schemas/recruiter.schema';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import RecruiterProfileFields from './RecruiterProfileFields';

type RecruiterProfileStepProps = {
  name: string;
  onSubmit: (values: RecruiterProfileFormData) => void;
};

export default function RecruiterProfileStep({ name, onSubmit }: RecruiterProfileStepProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RecruiterProfileFormData>({
    resolver: zodResolver(recruiterProfileSchema),
    mode: 'onTouched',
    defaultValues: { name, gender: 'MALE', companyName: '', city: '', districtWard: '' },
  });

  const saveProfile = useMutation({
    mutationFn: ({ city, ...values }: RecruiterProfileFormData) =>
      recruiterAuthApi.updateProfile({ ...values, province: city }),
    onSuccess: (profile, values) => {
      const { accessToken, user } = useAuthStore.getState().recruiter;
      if (accessToken && user) {
        useAuthStore.getState().setSession({ accessToken, user: { ...user, name: profile.name } }, 'recruiter');
      }
      onSubmit(values);
    },
    onError: (error) => applyFormError(error, setError, ['name', 'gender', 'companyName', 'city', 'districtWard']),
  });

  return (
    <form onSubmit={handleSubmit((values) => saveProfile.mutate(values))} noValidate className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Recruiter information</h2>
      <FormErrorAlert message={errors.root?.message} />
      <RecruiterProfileFields register={register} errors={errors} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={saveProfile.isPending} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Save and continue
        </Button>
      </div>
    </form>
  );
}
