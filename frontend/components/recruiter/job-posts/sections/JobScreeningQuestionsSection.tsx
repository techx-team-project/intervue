'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { Controller, UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';

const QUESTION_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'Free text' },
  { value: 'YES_NO', label: 'Yes / No' },
  { value: 'SINGLE_CHOICE', label: 'Single choice' },
];

const PRESET_QUESTIONS = [
  {
    question: 'How many years of relevant experience do you have in this role?',
    type: 'TEXT' as const,
    required: true,
  },
  { question: 'Are you comfortable working on-site or hybrid as specified?', type: 'YES_NO' as const, required: true },
  { question: 'What is your expected gross monthly salary (VND)?', type: 'TEXT' as const, required: false },
  { question: 'What is your notice period or earliest start date?', type: 'TEXT' as const, required: false },
];

let questionSequence = 0;
function generateQuestionId(): string {
  questionSequence += 1;
  return `sq-${Date.now()}-${questionSequence}`;
}

interface JobScreeningQuestionsSectionProps {
  form: UseFormReturn<JobPostFormData>;
}

export default function JobScreeningQuestionsSection({ form }: JobScreeningQuestionsSectionProps) {
  const { control, register, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'screeningQuestions' });

  const handleAddQuestion = () => {
    append({
      id: generateQuestionId(),
      question: '',
      required: false,
      type: 'TEXT',
      options: [],
    });
  };

  const handleAddPreset = (preset: (typeof PRESET_QUESTIONS)[number]) => {
    append({
      id: generateQuestionId(),
      question: preset.question,
      required: preset.required,
      type: preset.type,
      options: [],
    });
  };

  return (
    <section
      id="section-screening"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
            4
          </span>
          <div>
            <h2 className="text-navy text-[16px] font-bold">Screening questions</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Optional — automatically screen candidates upon application.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={handleAddQuestion}
        >
          Add question
        </Button>
      </div>

      {/* Quick Question Presets */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          Suggested:
        </span>
        {PRESET_QUESTIONS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAddPreset(preset)}
            className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
          >
            + {preset.question}
          </button>
        ))}
      </div>

      {fields.length > 0 ? (
        <div className="mt-4 space-y-3">
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
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400">
          No screening questions yet. Add questions to filter out unqualified applicants early.
        </div>
      )}
    </section>
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
    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition-colors hover:border-slate-300">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <Input
            placeholder="e.g. How many years of experience do you have with Spring Boot?"
            error={error}
            {...register(`screeningQuestions.${index}.question` as const)}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select options={QUESTION_TYPE_OPTIONS} {...register(`screeningQuestions.${index}.type` as const)} />

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                {...register(`screeningQuestions.${index}.required` as const)}
              />
              <span>Required answer</span>
            </label>
          </div>

          {type === 'SINGLE_CHOICE' && (
            <Controller
              control={control}
              name={`screeningQuestions.${index}.options` as const}
              render={({ field }) => (
                <TagInput
                  label="Options"
                  placeholder="Type an option and press Enter"
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove question"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
