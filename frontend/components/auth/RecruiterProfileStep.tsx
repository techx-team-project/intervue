'use client';

import Button from '@/components/ui/Button';
import { recruiterProfileSchema, type RecruiterProfileFormData } from '@/schemas/recruiter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import RecruiterProfileFields from './RecruiterProfileFields';

type RecruiterProfileStepProps = {
  name: string;
  onSubmit: (values: RecruiterProfileFormData) => void;
};

export default function RecruiterProfileStep({ name, onSubmit }: RecruiterProfileStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecruiterProfileFormData>({
    resolver: zodResolver(recruiterProfileSchema),
    mode: 'onTouched',
    defaultValues: { name, gender: 'MALE', phone: '', companyName: '', city: '', districtWard: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <h2 className="text-on-surface text-lg font-bold sm:text-xl">Recruiter information</h2>
      <RecruiterProfileFields register={register} errors={errors} />
      <div className="flex justify-end">
        <Button type="submit" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Save and continue
        </Button>
      </div>
    </form>
  );
}
