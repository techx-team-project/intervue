'use client';

import { useEffect, useState, useTransition } from 'react';
import { Sparkles, AlertCircle, Quote, Wrench, Clock, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getCvReviewQuota, requestCvReview } from '@/apiRequest/ai';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import type { CvReviewQuota, CvReviewResult } from '@/types/cv-review';

interface CvReviewPanelProps {
  resumeId?: number;
  cvText?: string;
  targetPosition?: string;
  className?: string;
}

export default function CvReviewPanel({ resumeId, cvText, targetPosition, className = '' }: CvReviewPanelProps) {
  const [quota, setQuota] = useState<CvReviewQuota | null>(null);
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  useEffect(() => {
    let active = true;
    void getCvReviewQuota().then(
      (data) => {
        if (active && data) {
          setQuota(data);
        }
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);

  const handleReviewClick = () => {
    requestConsent(() => {
      startTransition(async () => {
        setError(null);
        try {
          const result = await requestCvReview({
            resumeId,
            cvText,
            targetPosition,
          });
          setReviewResult(result);
          const updatedQuota = await getCvReviewQuota().catch(() => null);
          if (updatedQuota) setQuota(updatedQuota);
        } catch (err: unknown) {
          const apiErr = err as { message?: string };
          setError(apiErr?.message || 'Could not review your CV right now. Please try again later.');
        }
      });
    });
  };

  return (
    <div className={`border-outline-variant rounded-xl border bg-white p-5 shadow-sm ${className}`}>
      {consentDialog}

      {/* Header and Quota status */}
      <div className="border-outline-variant flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary-container text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-on-surface text-base font-bold">AI CV review & improvement tips</h3>
          </div>
          <p className="text-on-surface-variant mt-1 text-xs">
            Analyze wording, optimize for ATS filters and spot places that lack measurable results.
          </p>
        </div>

        {quota && (
          <div className="flex flex-col sm:items-end">
            <div className="text-on-surface flex items-center gap-1.5 text-xs font-semibold">
              <Clock className="text-primary h-3.5 w-3.5" />
              <span>
                {' '}
                <strong className={quota.remaining > 0 ? 'text-primary' : 'text-error'}>
                  {quota.remaining}/{quota.maxDaily}
                </strong>{' '}
                reviews left today
              </span>
            </div>
            <span className="text-label-sm text-outline">(Resets at 00:00 Vietnam time)</span>
          </div>
        )}
      </div>

      {/* Privacy disclaimer - Only Candidate Sees It */}
      <div className="border-outline-variant bg-surface-container-low text-on-surface-variant mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
        <ShieldCheck className="text-primary h-4 w-4 shrink-0" />
        <span>
          <strong>Privacy:</strong> Only you can see this feedback. Recruiters cannot xem.
        </span>
      </div>

      {/* Action CTA */}
      {!reviewResult && (
        <div className="border-outline-variant bg-surface-container-low/50 mt-5 rounded-xl border-2 border-dashed py-6 text-center">
          <FileText className="text-outline mx-auto mb-2 h-10 w-10" />
          <p className="text-on-surface mb-1 text-sm font-medium">
            Get detailed feedback on every experience line in your CV
          </p>
          <p className="text-on-surface-variant mx-auto mb-4 max-w-md text-xs">
            Each comment quotes your CV, explains what is weak and offers a STAR-style rewrite.
          </p>
          <Button
            onClick={handleReviewClick}
            disabled={isPending || (quota !== null && quota.remaining <= 0)}
            className="bg-primary hover:bg-primary-hover rounded-lg px-5 py-2.5 text-xs font-semibold text-white shadow-sm"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Analyzing CV...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Review CV with AI
              </span>
            )}
          </Button>
          {quota && quota.remaining <= 0 && (
            <p className="text-error mt-2 text-xs">
              You have used all 3 free reviews today. Please come back after 00:00.
            </p>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="border-error/30 bg-error/10 text-error mt-4 flex items-center gap-2 rounded-lg border p-3 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Review Result View */}
      {reviewResult && (
        <div className="mt-5 space-y-4">
          {/* Summary Banner */}
          <div className="bg-primary-light flex flex-col items-start justify-between gap-3 rounded-xl border border-emerald-100 p-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-on-primary-container text-xs font-bold tracking-wider uppercase">
                  Review overview
                </span>
                {reviewResult.fromCache && (
                  <span className="text-label-sm inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                    ⚡ CV unchanged: saved result loaded (no review used)
                  </span>
                )}
              </div>
              <p className="text-on-surface text-xs leading-relaxed">{reviewResult.summary}</p>
            </div>
            {reviewResult.overallScore > 0 && (
              <div className="border-primary/30 flex shrink-0 flex-col items-center justify-center rounded-lg border bg-white px-3 py-2 shadow-xs">
                <span className="text-label-sm text-on-surface-variant font-semibold uppercase">
                  Estimated ATS score
                </span>
                <span className="text-primary text-xl font-bold">{reviewResult.overallScore}/100</span>
              </div>
            )}
          </div>

          {/* Comments List (Quote → Problem → Fix) */}
          <div className="space-y-3">
            <h4 className="text-on-surface-variant text-xs font-bold tracking-wider uppercase">
              Details to improve ({reviewResult.comments.length} comments)
            </h4>

            {reviewResult.comments.map((comment, idx) => (
              <div
                key={idx}
                className="border-outline-variant hover:border-outline rounded-lg border bg-white p-4 shadow-2xs transition-colors"
              >
                {comment.section && (
                  <span className="bg-surface-container-high text-label-sm text-on-surface-variant mb-2.5 inline-block rounded px-2 py-0.5 font-bold tracking-wider uppercase">
                    Section: {comment.section}
                  </span>
                )}

                {/* 1. Quote from CV */}
                <div className="mb-2.5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Quote className="h-3.5 w-3.5" />
                    <span>Quote from your CV:</span>
                  </div>
                  <blockquote className="text-on-surface rounded-md border-l-3 border-amber-400 bg-amber-50/70 p-2.5 font-mono text-xs italic">
                    &ldquo;{comment.quote}&rdquo;
                  </blockquote>
                </div>

                {/* 2. Problem */}
                <div className="mb-2.5">
                  <div className="text-error mb-1 flex items-center gap-1.5 text-xs font-bold">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Issue found:</span>
                  </div>
                  <p className="border-error/30 bg-error/10 text-on-surface rounded-md border p-2.5 text-xs leading-relaxed">
                    {comment.problem}
                  </p>
                </div>

                {/* 3. Fix */}
                <div>
                  <div className="text-on-primary-container mb-1 flex items-center gap-1.5 text-xs font-bold">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Suggested edit & sample wording:</span>
                  </div>
                  <div className="border-primary/30 text-on-primary-container rounded-md border bg-emerald-50/80 p-2.5 text-xs leading-relaxed font-medium">
                    {comment.fix}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Re-analyze button */}
          <div className="pt-2 text-center">
            <Button
              onClick={handleReviewClick}
              disabled={isPending || (quota !== null && quota.remaining <= 0)}
              variant="outline"
              className="border-outline hover:bg-surface-container-low px-4 py-2 text-xs"
            >
              <RefreshCw className={`mr-1.5 h-3 w-3 ${isPending ? 'animate-spin' : ''}`} />
              Review CV again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
