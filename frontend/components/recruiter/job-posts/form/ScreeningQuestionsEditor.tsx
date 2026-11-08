'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { TagInput } from '@/components/ui/TagInput';
import { cn } from '@/lib/utils';
import {
  SCREENING_MAX_OPTIONS,
  SCREENING_MAX_QUESTIONS,
  type JobPostFormData,
  type ScreeningQuestionFormData,
} from '@/schemas/job.schema';
import { Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

const TYPE_OPTIONS: Array<{ value: ScreeningQuestionFormData['type']; label: string }> = [
  { value: 'SHORT_TEXT', label: 'Trả lời ngắn' },
  { value: 'CHOICE', label: 'Chọn đáp án' },
];

const NEW_QUESTION: ScreeningQuestionFormData = { type: 'SHORT_TEXT', prompt: '', required: false, options: [] };

export default function ScreeningQuestionsEditor() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'screeningQuestions' });
  const questions = watch('screeningQuestions');
  const listError = errors.screeningQuestions?.root?.message ?? errors.screeningQuestions?.message;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Ứng viên trả lời khi nộp hồ sơ. Tối đa {SCREENING_MAX_QUESTIONS} câu — càng ít càng nhiều người ứng tuyển.
        </p>
        <span className="shrink-0 text-xs font-semibold text-slate-500">
          {fields.length}/{SCREENING_MAX_QUESTIONS}
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-500">
          Chưa có câu hỏi nào. Ứng viên chỉ cần nộp CV.
        </p>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => {
            const question = questions[index];
            const itemErrors = errors.screeningQuestions?.[index];
            return (
              <li key={field.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-start gap-2">
                  <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder="Ví dụ: Bạn có bao nhiêu năm kinh nghiệm với React?"
                      aria-label={`Câu hỏi ${index + 1}`}
                      error={itemErrors?.prompt?.message}
                      {...register(`screeningQuestions.${index}.prompt`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Xóa câu hỏi ${index + 1}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pl-7">
                  <Controller
                    control={control}
                    name={`screeningQuestions.${index}.type`}
                    render={({ field: typeField }) => (
                      <div
                        role="radiogroup"
                        aria-label="Loại câu hỏi"
                        className="flex gap-1 rounded-lg bg-slate-100 p-0.5"
                      >
                        {TYPE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={typeField.value === option.value}
                            onClick={() => typeField.onChange(option.value)}
                            className={cn(
                              'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                              typeField.value === option.value
                                ? 'bg-white text-emerald-700 shadow-xs'
                                : 'text-slate-500 hover:text-slate-700',
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`screeningQuestions.${index}.required`}
                    render={({ field: requiredField }) => (
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        Bắt buộc
                        <Switch
                          size="sm"
                          ariaLabel={`Bắt buộc trả lời câu ${index + 1}`}
                          checked={requiredField.value}
                          onChange={requiredField.onChange}
                        />
                      </label>
                    )}
                  />
                </div>

                {question?.type === 'CHOICE' && (
                  <div className="pl-7">
                    <Controller
                      control={control}
                      name={`screeningQuestions.${index}.options`}
                      render={({ field: optionsField }) => (
                        <TagInput
                          value={optionsField.value}
                          onChange={optionsField.onChange}
                          maxTags={SCREENING_MAX_OPTIONS}
                          placeholder="Nhập đáp án rồi nhấn Enter"
                          helperText="2-6 đáp án khác nhau"
                          error={itemErrors?.options?.message}
                        />
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {listError && <p className="text-xs font-medium text-rose-600">{listError}</p>}

      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Plus className="h-4 w-4" />}
        disabled={fields.length >= SCREENING_MAX_QUESTIONS}
        onClick={() => append({ ...NEW_QUESTION, options: [] })}
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
}
