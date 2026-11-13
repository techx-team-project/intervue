'use client';

import type { ResumeMatchApiResponse } from '@/apiRequest/ai';
import { Button } from '@/components/ui/Button';
import { useAnalyzeApplicationResume, useResumeMatchQuota } from '@/hooks/useResumeMatch';
import type { ReviewApplication } from '@/types/application-review';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2, CircleHelp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function QuotaChip() {
  const { data, isLoading, isError } = useResumeMatchQuota();

  if (isLoading) return <span className="text-xs text-slate-400">Loading usage…</span>;
  if (isError || !data) return <span className="text-xs text-slate-400">Usage unavailable</span>;

  const tone = data.totalRemaining === 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700';

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {data.totalRemaining} left
      <span className="font-normal">
        {' '}
        ({data.freeRemaining}/{data.freeLimit} free this month
        {data.paidRemaining > 0 ? ` + ${data.paidRemaining} purchased` : ''})
      </span>
    </span>
  );
}

function MatchResult({ result }: { result: ResumeMatchApiResponse }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-700">Experience summary</p>
        <p className="mt-1 text-sm whitespace-pre-line text-slate-600">{result.experienceSummary}</p>
      </div>

      <ul className="space-y-2">
        {result.requirements.map((item) => (
          <li key={item.requirement} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-2">
              {item.hasEvidence ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">{item.requirement}</p>
                <p className="text-xs text-slate-600">{item.evidence}</p>
                {item.clarificationNote && <p className="text-xs text-amber-700">{item.clarificationNote}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {result.questionsToAsk.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-700">Worth asking about</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {result.questionsToAsk.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-slate-400">
        {result.model} · {result.promptVersion} · {formatDateTime(result.analyzedAt)}
      </p>
      <p className="text-[11px] text-slate-500">{result.disclaimer}</p>
    </div>
  );
}

export default function ReviewAiMatchPanel({ application }: { application: ReviewApplication }) {
  const analyze = useAnalyzeApplicationResume(application.id);
  const hasCv = Boolean(application.cv);

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
          Match CV to job requirements (AI)
        </h3>
        <QuotaChip />
      </div>

      {!hasCv ? (
        <p className="text-xs text-slate-500">This application has no CV attached, so it cannot be matched.</p>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            AI only cites evidence from the CV. It does not score or decide for you. Each analysis uses 1 AI Resume
            Match unit.
          </p>

          <Button
            size="sm"
            disabled={analyze.isPending}
            onClick={() => analyze.mutate(undefined, { onError: (error) => toast.error(getErrorMessage(error)) })}
          >
            {analyze.isPending ? 'Analyzing…' : analyze.data ? 'Analyze again' : 'Analyze with AI'}
          </Button>

          {analyze.data && <MatchResult result={analyze.data} />}
        </>
      )}
    </section>
  );
}
