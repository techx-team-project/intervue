import Textarea from '@/components/ui/Textarea';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import JobAiFillFromFileCard from './JobAiFillFromFileCard';
import JobAiGenerateCard from './JobAiGenerateCard';

interface JobDescriptionSectionProps {
  form: UseFormReturn<JobPostFormData>;
  isAiGenerated: boolean;
  onAiContentApplied: () => void;
}

export default function JobDescriptionSection({ form, isAiGenerated, onAiContentApplied }: JobDescriptionSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <h2 className="text-navy text-[15px] font-bold">Job description & requirements</h2>

      <div className="mt-4 space-y-4">
        <JobAiGenerateCard form={form} onGenerated={onAiContentApplied} />
        <JobAiFillFromFileCard form={form} onFilled={onAiContentApplied} />

        {isAiGenerated && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>AI-generated content (demo) — please review before publishing.</span>
          </div>
        )}

        <Textarea
          label="Job description"
          placeholder="Describe the role and its main responsibilities..."
          error={errors.description?.message}
          {...register('description')}
        />
        <Textarea
          label="Candidate requirements"
          placeholder="Required skills, experience and qualifications..."
          error={errors.requirements?.message}
          {...register('requirements')}
        />
        <Textarea
          label="Benefits"
          placeholder="Salary, bonus, insurance and perks..."
          error={errors.benefits?.message}
          {...register('benefits')}
        />
      </div>
    </div>
  );
}
