'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Plus, Trash2 } from 'lucide-react';
import { Controller, UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';

const QUESTION_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'Trả lời tự do' },
  { value: 'YES_NO', label: 'Có/Không' },
  { value: 'SINGLE_CHOICE', label: 'Chọn 1 đáp án' },
];

interface JobScreeningQuestionsSectionProps {
  form: UseFormReturn<JobPostFormData>;
}

export default function JobScreeningQuestionsSection({ form }: JobScreeningQuestionsSectionProps) {
  const { control, register, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'screeningQuestions' });

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-navy text-[15px] font-bold">Câu hỏi sàng lọc</h2>
          <p className="mt-0.5 text-[12px] text-[#64748b]">Tùy chọn — giúp sàng lọc ứng viên ngay khi họ ứng tuyển.</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() =>
            append({
              id: `sq-${Date.now()}`,
              question: '',
              required: false,
              type: 'TEXT',
              options: [],
            })
          }
        >
          Thêm câu hỏi
        </Button>
      </div>

      {fields.length > 0 && (
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <ScreeningQuestionRow
              key={field.id}
              form={form}
              index={index}
              onRemove={() => remove(index)}
              error={formState.errors.screeningQuestions?.[index]?.question?.message}
              register={register}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ScreeningQuestionRowProps {
  form: UseFormReturn<JobPostFormData>;
  index: number;
  onRemove: () => void;
  error?: string;
  register: UseFormReturn<JobPostFormData>['register'];
}

function ScreeningQuestionRow({ form, index, onRemove, error, register }: ScreeningQuestionRowProps) {
  const { control } = form;
  const type = useWatch({ control, name: `screeningQuestions.${index}.type` });

  return (
    <div className="rounded-xl border border-[#e9eaec] p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <Input
            placeholder="Nhập câu hỏi sàng lọc"
            error={error}
            {...register(`screeningQuestions.${index}.question` as const)}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select options={QUESTION_TYPE_OPTIONS} {...register(`screeningQuestions.${index}.type` as const)} />

            <label className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                {...register(`screeningQuestions.${index}.required` as const)}
              />
              <span>Bắt buộc trả lời</span>
            </label>
          </div>

          {type === 'SINGLE_CHOICE' && (
            <Controller
              control={control}
              name={`screeningQuestions.${index}.options`}
              render={({ field }) => (
                <TagInput
                  placeholder="Nhập đáp án rồi nhấn Enter"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  helperText="Thêm tối thiểu 2 đáp án"
                />
              )}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Xóa câu hỏi"
          className="shrink-0 cursor-pointer rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
