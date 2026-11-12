'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { JOB_MAX_HIRING_STEPS, type JobPostFormData } from '@/schemas/job.schema';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const SUGGESTED_STEPS = ['Sàng lọc hồ sơ', 'Phỏng vấn kỹ thuật', 'Phỏng vấn HR', 'Offer'];

export default function HiringStepsEditor() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'hiringSteps' });
  const used = watch('hiringSteps').map((step) => step.title.trim().toLowerCase());
  const isFull = fields.length >= JOB_MAX_HIRING_STEPS;
  const suggestions = SUGGESTED_STEPS.filter((title) => !used.includes(title.toLowerCase()));

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <p className="border-outline text-on-surface-variant rounded-xl border border-dashed px-4 py-6 text-center text-xs">
          Chưa có bước nào. Ứng viên sẽ không thấy quy trình tuyển dụng của bạn.
        </p>
      ) : (
        <ol className="space-y-2">
          {fields.map((field, index) => (
            <li key={field.id} className="flex items-start gap-2">
              <span className="bg-surface-container-high text-navy text-label-sm mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <Input
                  placeholder="Ví dụ: Phỏng vấn kỹ thuật"
                  aria-label={`Bước ${index + 1}`}
                  error={errors.hiringSteps?.[index]?.title?.message}
                  {...register(`hiringSteps.${index}.title`)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Xóa bước ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {suggestions.map((title) => (
          <Button
            key={title}
            type="button"
            size="sm"
            variant="outline"
            disabled={isFull}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => append({ title })}
          >
            {title}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isFull}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => append({ title: '' })}
        >
          Bước khác
        </Button>
        <span className="text-body-sm text-on-surface-variant ml-auto">
          {fields.length}/{JOB_MAX_HIRING_STEPS}
        </span>
      </div>
    </div>
  );
}
