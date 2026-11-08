'use client';

import { generateCoverLetter } from '@/apiRequest/ai';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import { useApplicationMutations } from '@/hooks/useCandidateApplication';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { isApiError } from '@/lib/api-error';
import type { ApplyForm, CandidateResume, SaveApplicationPayload } from '@/types/candidate-application';
import { getErrorMessage } from '@/utils/error';
import { Check, Send, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ApplyQuestionField from './ApplyQuestionField';
import CvPicker from './CvPicker';

const AUTOSAVE_DELAY_MS = 1500;
const MAX_COVER_LETTER = 5000;

interface ApplyDraftFormProps {
  jobTitle: string;
  companyName: string;
  requirements: string[];
  description?: string;
  form: ApplyForm;
  resumes: CandidateResume[];
  onSubmitted: () => void;
}

export default function ApplyDraftForm({
  jobTitle,
  companyName,
  requirements,
  description,
  form,
  resumes,
  onSubmitted,
}: ApplyDraftFormProps) {
  const draft = form.application;
  const { saveDraft, submit } = useApplicationMutations(form.jobId);
  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  const [resumeId, setResumeId] = useState<number | undefined>(
    draft?.resumeId ?? resumes.find((resume) => resume.isDefault)?.id ?? resumes[0]?.id,
  );
  const [coverLetter, setCoverLetter] = useState(draft?.coverLetter ?? '');
  const [answers, setAnswers] = useState<Record<number, string>>(
    Object.fromEntries((draft?.answers ?? []).map((answer) => [answer.questionId, answer.answer])),
  );
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const payload = useMemo<SaveApplicationPayload>(
    () => ({
      jobId: form.jobId,
      resumeId,
      coverLetter,
      answers: Object.entries(answers)
        .filter(([, value]) => value.trim() !== '')
        .map(([questionId, answer]) => ({ questionId: Number(questionId), answer })),
    }),
    [form.jobId, resumeId, coverLetter, answers],
  );

  const serialized = JSON.stringify(payload);
  const debounced = useDebouncedValue(serialized, AUTOSAVE_DELAY_MS);
  const lastSaved = useRef(serialized);

  useEffect(() => {
    if (debounced === lastSaved.current) return;
    lastSaved.current = debounced;
    saveDraft.mutate(JSON.parse(debounced) as SaveApplicationPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a changed draft should trigger a save
  }, [debounced]);

  const handleGenerate = () => {
    requestConsent(async () => {
      setIsGenerating(true);
      try {
        const response = await generateCoverLetter({
          jobTitle,
          companyName,
          jobRequirements: requirements,
          jobDescription: description,
        });
        setCoverLetter(response.coverLetter.slice(0, MAX_COVER_LETTER));
        toast.success('Cover letter draft created. Review and edit it before sending.');
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsGenerating(false);
      }
    });
  };

  const validate = (): boolean => {
    const next: Record<number, string> = {};
    form.questions.forEach((question) => {
      if (question.required && !(answers[question.id] ?? '').trim()) {
        next[question.id] = 'Please answer this question.';
      }
    });
    setErrors(next);
    if (!resumeId) {
      toast.error('Please select or upload a CV.');
      return false;
    }
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    submit.mutate(payload, {
      onSuccess: () => {
        toast.success('Application submitted!');
        onSubmitted();
      },
      onError: (error) => {
        if (isApiError(error)) {
          const next: Record<number, string> = {};
          error.details.forEach((detail) => {
            const match = /^answers\[(\d+)\]$/.exec(detail.field ?? '');
            const question = match ? form.questions[Number(match[1])] : undefined;
            if (question) next[question.id] = detail.message;
          });
          if (Object.keys(next).length > 0) {
            setErrors(next);
            return;
          }
        }
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="space-y-5">
      {consentDialog}

      <CvPicker resumes={resumes} value={resumeId} onChange={setResumeId} />

      {form.questions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-on-surface text-sm font-bold">Questions from the recruiter</h4>
          {form.questions.map((question, index) => (
            <ApplyQuestionField
              key={question.id}
              index={index}
              question={question}
              value={answers[question.id] ?? ''}
              error={errors[question.id]}
              onChange={(value) => setAnswers((previous) => ({ ...previous, [question.id]: value }))}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-on-surface text-sm font-semibold">Cover letter (optional)</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isLoading={isGenerating}
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={handleGenerate}
          >
            Suggest with AI
          </Button>
        </div>
        <Textarea
          value={coverLetter}
          rows={5}
          maxLength={MAX_COVER_LETTER}
          aria-label="Cover letter"
          placeholder="Why are you a good fit for this role?"
          onChange={(event) => setCoverLetter(event.target.value)}
        />
      </div>

      <div className="border-outline-variant flex items-center justify-between gap-3 border-t pt-4">
        <span className="text-outline flex items-center gap-1.5 text-xs" aria-live="polite">
          {saveDraft.isPending ? (
            'Saving draft…'
          ) : saveDraft.isSuccess ? (
            <>
              <Check className="text-primary h-3.5 w-3.5" aria-hidden /> Draft saved
            </>
          ) : (
            'Draft saves automatically'
          )}
        </span>
        <Button isLoading={submit.isPending} leftIcon={<Send className="h-4 w-4" />} onClick={handleSubmit}>
          Submit application
        </Button>
      </div>
    </div>
  );
}
