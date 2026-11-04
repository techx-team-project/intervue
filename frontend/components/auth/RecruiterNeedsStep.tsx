'use client';

import HiringNeedFields from '@/components/recruiter/hiring-needs/HiringNeedFields';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { HIRING_NEED_DEFAULT_VALUES, RECRUITER_CONSULTATION_OPTIONS } from '@/constants/recruiter-onboarding';
import { ROUTES } from '@/constants/routes';
import { recruiterNeedsSchema, type RecruiterNeedsFormData } from '@/schemas/recruiter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type RecruiterNeedsStepProps = {
  onSubmit: (values: RecruiterNeedsFormData) => void;
  onSkip: () => void;
};

export default function RecruiterNeedsStep({ onSubmit, onSkip }: RecruiterNeedsStepProps) {
  const form = useForm<RecruiterNeedsFormData>({
    resolver: zodResolver(recruiterNeedsSchema),
    mode: 'onTouched',
    defaultValues: HIRING_NEED_DEFAULT_VALUES,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Hiring needs</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Tell us about the role you most need to fill right now. You can add or edit other roles anytime in{' '}
          <Link
            href={ROUTES.RECRUITER_COMPANY_NEEDS}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Hiring needs
          </Link>
          .
        </p>
      </div>

      <HiringNeedFields form={form} />

      <Select
        id="consultation"
        label="Is there anything you would like advice on?"
        placeholder="Select a topic"
        options={RECRUITER_CONSULTATION_OPTIONS}
        {...form.register('consultation')}
      />

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onSkip}>
          Skip
        </Button>
        <Button type="submit" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Finish
        </Button>
      </div>
    </form>
  );
}
