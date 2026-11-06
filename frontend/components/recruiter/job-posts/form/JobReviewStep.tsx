'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  JOB_FORM_ARRANGEMENT_OPTIONS,
  JOB_FORM_CONTRACT_OPTIONS,
  JOB_FORM_LEVEL_OPTIONS,
} from '@/constants/recruiter-job';
import type { JobPostFormData } from '@/schemas/job.schema';
import { optionLabel } from '@/utils/recruiter-job';
import { Pencil } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface JobReviewStepProps {
  onEdit: (step: number) => void;
}

function salaryText(values: JobPostFormData) {
  if (values.salaryNegotiable) return 'Thỏa thuận';
  const unit = values.currency === 'VND' ? 'triệu VND' : 'USD';
  return `${values.salaryMin ?? '—'} – ${values.salaryMax ?? '—'} ${unit}`;
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
    <section className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<Pencil className="h-3.5 w-3.5" />}
          onClick={() => onEdit(step)}
        >
          Sửa
        </Button>
      </div>
      {children}
    </section>
  );
}

function TextPreview({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 line-clamp-3 text-sm whitespace-pre-line text-slate-700">{text.trim() || 'Chưa nhập'}</p>
    </div>
  );
}

export default function JobReviewStep({ onEdit }: JobReviewStepProps) {
  const { getValues } = useFormContext<JobPostFormData>();
  const values = getValues();

  return (
    <div className="space-y-4">
      <ReviewSection title="Thông tin chính" step={0} onEdit={onEdit}>
        <p className="text-base font-bold text-slate-900">{values.title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="info">{optionLabel(JOB_FORM_LEVEL_OPTIONS, values.level)}</Badge>
          <Badge>{optionLabel(JOB_FORM_CONTRACT_OPTIONS, values.contractType)}</Badge>
          <Badge>{optionLabel(JOB_FORM_ARRANGEMENT_OPTIONS, values.workingArrangement)}</Badge>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold text-slate-500">Nơi làm việc</dt>
            <dd className="text-slate-800">{[values.address, values.city].filter(Boolean).join(', ')}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Mức lương</dt>
            <dd className="text-slate-800">{salaryText(values)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Hạn nộp hồ sơ</dt>
            <dd className="text-slate-800">{values.deadline}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Số lượng cần tuyển</dt>
            <dd className="text-slate-800">{values.openings}</dd>
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

      <ReviewSection title="Nội dung" step={1} onEdit={onEdit}>
        <div className="space-y-3">
          <TextPreview label="Mô tả công việc" text={values.description} />
          <TextPreview label="Yêu cầu" text={values.requirements} />
          {values.benefits.trim() && <TextPreview label="Phúc lợi" text={values.benefits} />}
        </div>
      </ReviewSection>
    </div>
  );
}
