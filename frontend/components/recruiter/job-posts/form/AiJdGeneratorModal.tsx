'use client';

import type { JdGenerateResult } from '@/apiRequest/ai';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useGenerateJobDescription, useJdGenerateQuota } from '@/hooks/useJdGenerate';
import type { JobPostFormData } from '@/schemas/job.schema';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AiJdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  values: Pick<
    JobPostFormData,
    | 'title'
    | 'level'
    | 'contractType'
    | 'workingArrangement'
    | 'city'
    | 'skills'
    | 'description'
    | 'requirements'
    | 'benefits'
  >;
  onApply: (result: JdGenerateResult, overwriteFilled: boolean) => void;
}

export default function AiJdGeneratorModal({ isOpen, onClose, values, onApply }: AiJdGeneratorModalProps) {
  const quota = useJdGenerateQuota();
  const generate = useGenerateJobDescription();

  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [notes, setNotes] = useState('');
  const [draft, setDraft] = useState<JdGenerateResult | null>(null);
  const [overwriteFilled, setOverwriteFilled] = useState(true);

  const trimmedTitle = values.title.trim();
  const hasExisting = Boolean(values.description.trim() || values.requirements.trim() || values.benefits.trim());
  const noQuotaLeft = quota.data !== undefined && quota.data.totalRemaining <= 0;

  const handleGenerate = async () => {
    if (!trimmedTitle) return;
    const result = await generate.mutateAsync({
      title: trimmedTitle,
      level: values.level,
      contractType: values.contractType,
      workingArrangement: values.workingArrangement,
      city: values.city.trim() || undefined,
      skills: values.skills.map((skill) => skill.name),
      language,
      notes: notes.trim() || undefined,
    });
    setDraft(result);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate job description with AI"
      description="AI uses the title, level, working arrangement, skills and extra notes to write the Description, Requirements and Benefits."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="border-outline-variant bg-surface-container-low/60 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs">
          <div className="text-on-surface-variant">
            Position: <strong className="text-on-surface">{trimmedTitle || 'No title yet'}</strong>
            {values.skills.length > 0 && ` · ${values.skills.map((skill) => skill.name).join(', ')}`}
          </div>
          {quota.data && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
              {quota.data.totalRemaining} left ({quota.data.freeRemaining} free
              {quota.data.paidRemaining > 0 ? ` + ${quota.data.paidRemaining} from plan` : ''})
            </span>
          )}
        </div>

        {!trimmedTitle && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            Please enter the job title before using AI to generate a JD.
          </div>
        )}

        {noQuotaLeft && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            You have used all free JD generations this month. Buy an AI JD Generator plan in the Service Store.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-on-surface text-sm font-semibold">JD language:</span>
          <div className="border-outline-variant inline-flex rounded-lg border bg-white p-0.5">
            {(
              [
                ['vi', 'Vietnamese'],
                ['en', 'English'],
              ] as const
            ).map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition ${
                  language === code ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Extra notes for AI (optional)"
          rows={3}
          placeholder="e.g. E-commerce project, 12-person Agile team, microservices and SQL optimization experience required..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {generate.isError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            {getErrorMessage(generate.error)}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={handleGenerate}
            disabled={!trimmedTitle || noQuotaLeft}
            isLoading={generate.isPending}
          >
            {draft ? 'Regenerate draft' : 'Generate JD'}
          </Button>
        </div>

        {draft && (
          <div className="border-outline-variant bg-surface-container-low/40 space-y-3 rounded-2xl border p-4">
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              <PreviewBlock title="Job description" content={draft.description} />
              <PreviewBlock title="Candidate requirements" content={draft.requirements} />
              <PreviewBlock title="Benefits" content={draft.benefits} />
            </div>

            {hasExisting && (
              <label className="text-on-surface flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={overwriteFilled}
                  onChange={(event) => setOverwriteFilled(event.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                Overwrite sections that already have content (uncheck to fill only empty sections)
              </label>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="neutral" onClick={onClose}>
                Close
              </Button>
              <Button
                type="button"
                leftIcon={<Check className="h-4 w-4" />}
                onClick={() => onApply(draft, overwriteFilled)}
              >
                Apply to job post
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function PreviewBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <h4 className="text-navy text-xs font-bold uppercase">{title}</h4>
      <p className="text-on-surface mt-1.5 text-xs leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
