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
import ScreeningQuestionsEditor from './ScreeningQuestionsEditor';

type ContentField = 'description' | 'requirements' | 'benefits';
type ContentTab = ContentField | 'screeningQuestions';

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
  initialTab?: ContentTab;
}

export default function JobContentStep({ initialTab = 'description' }: JobContentStepProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const [active, setActive] = useState<ContentTab>(initialTab);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const tab = TABS.find((item) => item.field === active) ?? TABS[0];
  const questionCount = watch('screeningQuestions').length;
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5">
        <p className="text-xs font-medium text-emerald-900">
          Cần soạn nhanh Mô tả, Yêu cầu và Quyền lợi theo chuẩn IT?
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          leftIcon={<Sparkles className="h-3.5 w-3.5 text-emerald-600" />}
          onClick={() => setAiModalOpen(true)}
        >
          Tạo JD bằng AI
        </Button>
      </div>
      <div
        role="tablist"
        aria-label="Nội dung tin tuyển dụng"
        className="bg-surface-container-high flex gap-1.5 rounded-xl p-1"
      >
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
                active === item.field
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface',
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
        <button
          type="button"
          role="tab"
          aria-selected={active === 'screeningQuestions'}
          onClick={() => setActive('screeningQuestions')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm',
            active === 'screeningQuestions'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          Câu hỏi{questionCount > 0 && ` (${questionCount})`}
          {errors.screeningQuestions && <CircleAlert className="h-3.5 w-3.5 text-rose-500" />}
        </button>
      </div>

      {active === 'screeningQuestions' ? (
        <ScreeningQuestionsEditor />
      ) : (
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
      )}

      <AiJdGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        values={{ title, level, contractType, workingArrangement, city, skills, description, requirements, benefits }}
        onApply={(result, overwriteFilled) => {
          const applyField = (field: 'description' | 'requirements' | 'benefits', nextValue: string) => {
            if (!nextValue.trim()) return;
            if (!overwriteFilled && valuesForField(field).trim()) return;
            setValue(field, nextValue, { shouldDirty: true, shouldValidate: true });
          };
          const valuesForField = (field: 'description' | 'requirements' | 'benefits') =>
            field === 'description' ? description : field === 'requirements' ? requirements : benefits;

          applyField('description', result.description);
          applyField('requirements', result.requirements);
          applyField('benefits', result.benefits);
          setAiModalOpen(false);
          toast.success('Đã điền nội dung JD từ AI.');
        }}
      />
    </div>
  );
}
