'use client';

import { Button, buttonClassName } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { CvReviewResult } from '@/types/cv-review';
import { ChevronDown, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ReviewScore from './ReviewScore';

type MatchFilter = 'ALL' | 'MATCH' | 'PARTIAL' | 'MISSING';

const STATUS_LABELS: Record<string, string> = {
  MATCH: 'Meets requirement',
  PARTIAL: 'Partially meets',
  MISSING: 'Not met',
};

const STATUS_CLASSES: Record<string, string> = {
  MATCH: 'bg-primary-container text-on-primary-container',
  PARTIAL: 'bg-surface-container-high text-on-surface',
  MISSING: 'bg-error/10 text-error',
};

const FALLBACK_STRENGTHS = [
  'Relevant professional experience for the role',
  'Core technical skills are aligned',
  'Solid educational background',
];
const FALLBACK_GAPS = [
  'Add measurable results to your achievements',
  'Clarify projects related to the requirements',
  'State your personal role clearly',
];
const FALLBACK_TIPS = [
  'Add keywords from the job description to your summary',
  'Use the STAR model for your key projects',
  'Check that fonts and layout are ATS friendly',
];

type JobFitResultViewProps = {
  result: CvReviewResult;
  onReset: () => void;
  onOpenCreditHistory?: () => void;
};

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface border-outline-variant rounded-2xl border p-5">
      <h3 className="font-display text-title-md text-on-surface font-bold">{title}</h3>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={index} className="text-body-md text-on-surface flex gap-3">
            <span className="bg-surface-container-high text-label-md text-on-surface-variant flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function JobFitResultView({ result, onReset, onOpenCreditHistory }: JobFitResultViewProps) {
  const [filter, setFilter] = useState<MatchFilter>('ALL');
  const [showComments, setShowComments] = useState(false);

  const fitScore = result.jobFitScore ?? result.overallScore ?? 0;
  const matches = result.requirementMatches ?? [];
  const visibleMatches = matches.filter((item) => filter === 'ALL' || item.status === filter);
  const countOf = (status: string) => matches.filter((item) => item.status === status).length;

  const filters: Array<{ id: MatchFilter; label: string; count: number }> = [
    { id: 'ALL', label: 'All', count: matches.length },
    { id: 'MATCH', label: 'Met', count: countOf('MATCH') },
    { id: 'PARTIAL', label: 'Partial', count: countOf('PARTIAL') },
    { id: 'MISSING', label: 'Not met', count: countOf('MISSING') },
  ];

  return (
    <div className="space-y-4">
      <section className="bg-surface border-outline-variant rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
              Level 3 · Job match
            </p>
            <h2 className="font-display text-headline-sm text-on-surface font-bold">
              {result.jobTitle || 'Target job'}
            </h2>
            {result.companyName && <p className="text-body-lg text-on-surface-variant">{result.companyName}</p>}
          </div>
          <ReviewScore score={fitScore} suffix="%" label="Match" />
        </div>

        <div className="border-outline-variant text-body-md text-on-surface-variant mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p>
            {result.fromCache ? 'Loaded from cache, no credit used.' : `Charged ${result.chargedCredits ?? 1} credit.`}{' '}
            A failed AI run is refunded automatically.
          </p>
          {onOpenCreditHistory && (
            <button
              type="button"
              onClick={onOpenCreditHistory}
              className="text-label-lg text-primary cursor-pointer font-semibold hover:underline"
            >
              View credit history
            </button>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">Summary</h3>
          <p className="text-body-lg text-on-surface mt-2 leading-relaxed">{result.summary}</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <InsightList
          title="Top strengths"
          items={result.keyStrengths?.length ? result.keyStrengths : FALLBACK_STRENGTHS}
        />
        <InsightList title="Gaps to fix" items={result.gapAnalysis?.length ? result.gapAnalysis : FALLBACK_GAPS} />
        <InsightList
          title="Tips before applying"
          items={result.tailoringTips?.length ? result.tailoringTips : FALLBACK_TIPS}
        />
      </div>

      <section className="bg-surface border-outline-variant rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-title-lg text-on-surface font-bold">Requirement by requirement</h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              Each requirement of the job post compared with evidence found in your CV.
            </p>
          </div>
          <div role="group" aria-label="Filter requirements" className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  'text-label-lg h-9 cursor-pointer rounded-full border px-3.5 font-semibold transition-colors',
                  filter === item.id
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary',
                )}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {visibleMatches.length === 0 && (
            <li className="text-body-md text-on-surface-variant py-8 text-center">No requirements in this filter.</li>
          )}
          {visibleMatches.map((item, index) => (
            <li key={index} className="border-outline-variant rounded-xl border p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h4 className="text-body-lg text-on-surface font-semibold">{item.requirement}</h4>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      'text-label-md rounded-full px-2.5 py-1 font-bold',
                      STATUS_CLASSES[item.status] ?? 'bg-surface-container-high text-on-surface',
                    )}
                  >
                    {STATUS_LABELS[item.status] ?? item.status}
                  </span>
                  <span className="text-label-lg text-on-surface font-bold tabular-nums">{item.fitScore}%</span>
                </div>
              </div>

              <dl className="text-body-md mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
                    Evidence in your CV
                  </dt>
                  <dd className="text-on-surface mt-1 italic">
                    {item.cvEvidence?.trim() ? `“${item.cvEvidence}”` : 'No evidence found in your CV.'}
                  </dd>
                </div>
                <div>
                  <dt className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
                    Analysis
                  </dt>
                  <dd className="text-on-surface mt-1">{item.explanation}</dd>
                </div>
              </dl>

              {item.improvementTip && (
                <p className="bg-primary-light text-body-md text-on-surface mt-4 rounded-lg p-3">
                  <span className="text-primary font-semibold">How to improve: </span>
                  {item.improvementTip}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {result.comments && result.comments.length > 0 && (
        <section className="bg-surface border-outline-variant rounded-2xl border p-6">
          <button
            type="button"
            aria-expanded={showComments}
            onClick={() => setShowComments((previous) => !previous)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
          >
            <span className="font-display text-title-md text-on-surface font-bold">
              Writing and ATS comments ({result.comments.length})
            </span>
            <ChevronDown
              className={cn('text-on-surface-variant h-5 w-5 transition-transform', showComments && 'rotate-180')}
              aria-hidden
            />
          </button>
          {showComments && (
            <ul className="divide-outline-variant mt-4 divide-y">
              {result.comments.map((comment, index) => (
                <li key={index} className="text-body-md space-y-1.5 py-4">
                  <p className="text-on-surface font-semibold">{comment.section}</p>
                  <p className="text-on-surface-variant italic">&ldquo;{comment.quote}&rdquo;</p>
                  <p className="text-error">{comment.problem}</p>
                  <p className="text-on-surface">
                    <span className="text-primary font-semibold">Fix: </span>
                    {comment.fix}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="bg-surface border-outline-variant flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
        <Button variant="outline" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" aria-hidden />}>
          Match another job
        </Button>
        {result.jobId && (
          <Link href={`/jobs/${result.jobId}`} className={buttonClassName({ className: 'gap-2' })}>
            View and apply
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
