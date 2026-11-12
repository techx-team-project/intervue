'use client';

import { FormattedTextarea } from '@/components/recruiter/job-posts/FormattedTextarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { JobPostFormData } from '@/schemas/job.schema';
import { CheckCircle2, CircleAlert, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import AiJdGeneratorModal from './AiJdGeneratorModal';
import BenefitTagPicker from './BenefitTagPicker';
import FormSection from './FormSection';
import HiringStepsEditor from './HiringStepsEditor';
import ScreeningQuestionsEditor from './ScreeningQuestionsEditor';

type ContentField = 'description' | 'requirements' | 'benefits';

const TABS: Array<{ field: ContentField; label: string; hint: string; placeholder: string }> = [
  {
    field: 'description',
    label: 'Job description',
    hint: 'Minimum 50 characters',
    placeholder: 'Main responsibilities, the product and the team the candidate will join…',
  },
  {
    field: 'requirements',
    label: 'Requirements',
    hint: 'Minimum 20 characters',
    placeholder: 'Required experience, skills and qualifications…',
  },
  {
    field: 'benefits',
    label: 'Benefits',
    hint: 'Optional',
    placeholder: 'Compensation, insurance, work environment…',
  },
];

export default function JobContentStep() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const [active, setActive] = useState<ContentField>('description');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const tab = TABS.find((item) => item.field === active) ?? TABS[0];
  const [title, level, contractType, workingArrangement, city, skills, description, requirements, benefits] = watch([
    'title',
    'level',
    'contractType',
    'workingArrangement',
    'city',
    'skills',
    'description',
    'requirements',
    'benefits',
  ]);

  return (
    <div className="space-y-5">
      <FormSection title="Post content">
        <div className="border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5">
          <p className="text-on-surface-variant text-xs font-medium">
            Need to quickly draft the Description, Requirements and Benefits to IT standards?
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => setAiModalOpen(true)}
          >
            Generate JD with AI
          </Button>
        </div>

        <div role="tablist" aria-label="Job post content" className="border-outline-variant flex gap-1 border-b">
          {TABS.map((item) => {
            const hasError = Boolean(errors[item.field]);
            const filled = watch(item.field).trim().length > 0;
            return (
              <button
                key={item.field}
                type="button"
                role="tab"
                aria-selected={active === item.field}
                onClick={() => setActive(item.field)}
                className={cn(
                  '-mb-px flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors',
                  active === item.field
                    ? 'border-primary text-primary'
                    : 'text-on-surface-variant hover:text-on-surface border-transparent',
                )}
              >
                {item.label}
                {hasError ? (
                  <CircleAlert className="h-3.5 w-3.5 text-rose-500" />
                ) : (
                  filled && <CheckCircle2 className="text-primary h-3.5 w-3.5" />
                )}
              </button>
            );
          })}
        </div>

        <Controller
          key={tab.field}
          control={control}
          name={tab.field}
          render={({ field }) => (
            <FormattedTextarea
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              rows={12}
              placeholder={tab.placeholder}
              helperText={tab.hint}
              error={errors[tab.field]?.message}
              aria-label={tab.label}
            />
          )}
        />
      </FormSection>

      <FormSection title="Featured benefits" description="Shown as tags on the job detail page.">
        <Controller
          control={control}
          name="benefitTags"
          render={({ field }) => <BenefitTagPicker value={field.value} onChange={field.onChange} />}
        />
      </FormSection>

      <FormSection title="Hiring process" description="Candidates know the rounds ahead of time.">
        <HiringStepsEditor />
      </FormSection>

      <FormSection title="Screening questions">
        <ScreeningQuestionsEditor />
      </FormSection>

      <AiJdGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        values={{ title, level, contractType, workingArrangement, city, skills, description, requirements, benefits }}
        onApply={(result, overwriteFilled) => {
          const valuesForField = (field: ContentField) =>
            field === 'description' ? description : field === 'requirements' ? requirements : benefits;
          const applyField = (field: ContentField, nextValue: string) => {
            if (!nextValue.trim()) return;
            if (!overwriteFilled && valuesForField(field).trim()) return;
            setValue(field, nextValue, { shouldDirty: true, shouldValidate: true });
          };

          applyField('description', result.description);
          applyField('requirements', result.requirements);
          applyField('benefits', result.benefits);
          setAiModalOpen(false);
          toast.success('JD content filled in from AI.');
        }}
      />
    </div>
  );
}
