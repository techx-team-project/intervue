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
  { value: 'SHORT_TEXT', label: 'Short answer' },
  { value: 'CHOICE', label: 'Multiple choice' },
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
        <p className="text-on-surface-variant text-xs">
          Candidates answer when applying. Up to {SCREENING_MAX_QUESTIONS} questions — the fewer, the more people apply.
        </p>
        <span className="text-on-surface-variant shrink-0 text-xs font-semibold">
          {fields.length}/{SCREENING_MAX_QUESTIONS}
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="border-outline text-on-surface-variant rounded-xl border border-dashed px-4 py-6 text-center text-xs">
          No questions yet. Candidates only need to submit a CV.
        </p>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => {
            const question = questions[index];
            const itemErrors = errors.screeningQuestions?.[index];
            return (
              <li key={field.id} className="border-outline-variant space-y-3 rounded-xl border bg-white p-3.5">
                <div className="flex items-start gap-2">
                  <span className="text-label-sm mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder="e.g. How many years of experience do you have with React?"
                      aria-label={`Question ${index + 1}`}
                      error={itemErrors?.prompt?.message}
                      {...register(`screeningQuestions.${index}.prompt`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove question ${index + 1}`}
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
                        aria-label="Question type"
                        className="bg-surface-container-high flex gap-1 rounded-lg p-0.5"
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
                                : 'text-on-surface-variant hover:text-on-surface',
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
                      <label className="text-on-surface-variant flex items-center gap-2 text-xs font-semibold">
                        Required
                        <Switch
                          size="sm"
                          ariaLabel={`Answer required for question ${index + 1}`}
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
                          placeholder="Type an answer and press Enter"
                          helperText="2-6 distinct answers"
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
        Add question
      </Button>
    </div>
  );
}
