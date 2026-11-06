'use client';

import { FormattedTextarea } from '@/components/recruiter/job-posts/FormattedTextarea';
import { cn } from '@/lib/utils';
import type { JobPostFormData } from '@/schemas/job.schema';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type ContentField = 'description' | 'requirements' | 'benefits';

const TABS: Array<{ field: ContentField; label: string; hint: string; placeholder: string; required: boolean }> = [
  {
    field: 'description',
    label: 'Mô tả công việc',
    hint: 'Tối thiểu 50 ký tự',
    placeholder: 'Nhiệm vụ chính, sản phẩm và đội nhóm mà ứng viên sẽ tham gia…',
    required: true,
  },
  {
    field: 'requirements',
    label: 'Yêu cầu',
    hint: 'Tối thiểu 20 ký tự',
    placeholder: 'Kinh nghiệm, kỹ năng và bằng cấp cần có…',
    required: true,
  },
  {
    field: 'benefits',
    label: 'Phúc lợi',
    hint: 'Không bắt buộc',
    placeholder: 'Lương thưởng, bảo hiểm, môi trường làm việc…',
    required: false,
  },
];

interface JobContentStepProps {
  initialTab?: ContentField;
}

export default function JobContentStep({ initialTab = 'description' }: JobContentStepProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const [active, setActive] = useState<ContentField>(initialTab);
  const tab = TABS.find((item) => item.field === active) ?? TABS[0];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Nội dung tin tuyển dụng" className="flex gap-1.5 rounded-xl bg-slate-100 p-1">
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
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm',
                active === item.field ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {item.label}
              {hasError ? (
                <CircleAlert className="h-3.5 w-3.5 text-rose-500" />
              ) : (
                filled && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
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
    </div>
  );
}
