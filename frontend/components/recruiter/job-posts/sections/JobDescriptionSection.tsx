'use client';

import FormattedTextarea from '@/components/recruiter/job-posts/FormattedTextarea';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Info, Sparkles } from 'lucide-react';
import { Controller, UseFormReturn } from 'react-hook-form';
import JobAiFillFromFileCard from './JobAiFillFromFileCard';

interface JobDescriptionSectionProps {
  form: UseFormReturn<JobPostFormData>;
  isAiGenerated: boolean;
  onOpenAiAssistant: () => void;
  onAiContentApplied: () => void;
}

export default function JobDescriptionSection({
  form,
  isAiGenerated,
  onOpenAiAssistant,
  onAiContentApplied,
}: JobDescriptionSectionProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <section
      id="section-description"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
            3
          </span>
          <h2 className="text-navy text-[16px] font-bold">Job description & requirements</h2>
        </div>

        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xs transition-colors hover:bg-emerald-100"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>AI Assist</span>
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <JobAiFillFromFileCard form={form} onFilled={onAiContentApplied} />

        {isAiGenerated && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>AI-generated content applied — please review and customize before publishing.</span>
          </div>
        )}

        {/* Job Description with Rich Text Formatting */}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FormattedTextarea
              label="Role & Responsibilities"
              placeholder="Describe the day-to-day responsibilities, mission, and objectives of this position..."
              error={errors.description?.message}
              value={field.value}
              onChange={field.onChange}
              rows={6}
            />
          )}
        />

        {/* Candidate Requirements with Rich Text Formatting */}
        <Controller
          control={control}
          name="requirements"
          render={({ field }) => (
            <FormattedTextarea
              label="Candidate Requirements"
              placeholder="List required technical skills, years of experience, methodologies, and mindset..."
              error={errors.requirements?.message}
              value={field.value}
              onChange={field.onChange}
              rows={6}
            />
          )}
        />

        {/* Benefits with Rich Text Formatting */}
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <FormattedTextarea
              label="Perks & Benefits"
              placeholder="Salary review policy, 13th-month bonus, insurance, devices, team activities..."
              error={errors.benefits?.message}
              value={field.value}
              onChange={field.onChange}
              rows={5}
            />
          )}
        />
      </div>
    </section>
  );
}
