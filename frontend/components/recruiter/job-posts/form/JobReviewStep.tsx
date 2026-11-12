'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  JOB_FORM_ARRANGEMENT_OPTIONS,
  JOB_FORM_BENEFIT_OPTIONS,
  JOB_FORM_CONTRACT_OPTIONS,
  JOB_FORM_LEVEL_OPTIONS,
  JOB_FORM_ROLE_OPTIONS,
  JOB_FORM_SALARY_BASIS_OPTIONS,
} from '@/constants/recruiter-job';
import type { JobPostFormData } from '@/schemas/job.schema';
import { optionLabel } from '@/utils/recruiter-job';
import { Pencil } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface JobReviewStepProps {
  onEdit: (step: number) => void;
}

function salaryText(values: JobPostFormData) {
  if (values.salaryNegotiable) return 'Negotiable';
  const unit = values.currency === 'VND' ? 'million VND' : 'USD';
  const basis = optionLabel(JOB_FORM_SALARY_BASIS_OPTIONS, values.salaryBasis);
  return `${values.salaryMin ?? '—'} – ${values.salaryMax ?? '—'} ${unit} · ${basis}`;
}

function experienceText(values: JobPostFormData) {
  const { experienceMinYears: min, experienceMaxYears: max } = values;
  if (min === undefined && max === undefined) return 'Not required';
  if (min !== undefined && max !== undefined) return `${min} – ${max} years`;
  return min !== undefined ? `From ${min} years` : `Up to ${max} years`;
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-outline-variant rounded-xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-on-surface text-sm font-bold">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<Pencil className="h-3.5 w-3.5" />}
          onClick={() => onEdit(step)}
        >
          Edit
        </Button>
      </div>
      {children}
    </section>
  );
}

function TextPreview({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-on-surface-variant text-xs font-semibold">{label}</p>
      <p className="text-on-surface mt-1 line-clamp-3 text-sm whitespace-pre-line">{text.trim() || 'Not entered'}</p>
    </div>
  );
}

export default function JobReviewStep({ onEdit }: JobReviewStepProps) {
  const { getValues } = useFormContext<JobPostFormData>();
  const values = getValues();

  return (
    <div className="space-y-4">
      <ReviewSection title="Main info" step={0} onEdit={onEdit}>
        <p className="text-on-surface text-base font-bold">{values.title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="info">{optionLabel(JOB_FORM_ROLE_OPTIONS, values.jobRole)}</Badge>
          <Badge variant="info">{optionLabel(JOB_FORM_LEVEL_OPTIONS, values.level)}</Badge>
          <Badge>{optionLabel(JOB_FORM_CONTRACT_OPTIONS, values.contractType)}</Badge>
          <Badge>{optionLabel(JOB_FORM_ARRANGEMENT_OPTIONS, values.workingArrangement)}</Badge>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-on-surface-variant text-xs font-semibold">Location</dt>
            <dd className="text-on-surface">{[values.address, values.city].filter(Boolean).join(', ')}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant text-xs font-semibold">Salary</dt>
            <dd className="text-on-surface">{salaryText(values)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant text-xs font-semibold">Experience</dt>
            <dd className="text-on-surface">{experienceText(values)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant text-xs font-semibold">Application deadline</dt>
            <dd className="text-on-surface">{values.deadline}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant text-xs font-semibold">Number of openings</dt>
            <dd className="text-on-surface">{values.openings}</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {values.skills.map((skill) => (
            <Badge key={skill.id} variant="success">
              {skill.name}
            </Badge>
          ))}
        </div>
      </ReviewSection>

      <ReviewSection title="Content" step={1} onEdit={onEdit}>
        <div className="space-y-3">
          <TextPreview label="Job description" text={values.description} />
          <TextPreview label="Requirements" text={values.requirements} />
          {values.benefits.trim() && <TextPreview label="Benefits" text={values.benefits} />}
          {values.benefitTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {values.benefitTags.map((tag) => (
                <Badge key={tag}>{optionLabel(JOB_FORM_BENEFIT_OPTIONS, tag)}</Badge>
              ))}
            </div>
          )}
          {values.hiringSteps.length > 0 && (
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Hiring process</p>
              <p className="text-on-surface mt-1 text-sm">{values.hiringSteps.map((step) => step.title).join(' → ')}</p>
            </div>
          )}
          <p className="text-on-surface-variant text-xs">
            {values.screeningQuestions.length > 0
              ? `${values.screeningQuestions.length} screening questions`
              : 'No screening questions'}
          </p>
        </div>
      </ReviewSection>
    </div>
  );
}
