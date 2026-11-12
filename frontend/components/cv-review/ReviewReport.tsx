import { Button } from '@/components/ui/Button';
import type { CvReviewResult } from '@/types/cv-review';
import { RotateCcw } from 'lucide-react';
import ReviewScore from './ReviewScore';

type ReviewReportProps = {
  result: CvReviewResult;
  onReset: () => void;
};

export default function ReviewReport({ result, onReset }: ReviewReportProps) {
  return (
    <div className="space-y-4">
      <section className="bg-surface border-outline-variant rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
              {result.fromCache ? 'Saved result' : 'New AI review'} · {result.modelVersion}
            </p>
            <h2 className="font-display text-headline-sm text-on-surface font-bold">ATS review report</h2>
          </div>
          <ReviewScore score={result.overallScore} label="ATS score" />
        </div>
        <div className="border-outline-variant mt-6 border-t pt-5">
          <h3 className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">Summary</h3>
          <p className="text-body-lg text-on-surface mt-2 leading-relaxed">{result.summary}</p>
        </div>
      </section>

      <section className="bg-surface border-outline-variant rounded-2xl border p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-title-lg text-on-surface font-bold">Specific feedback</h3>
          <span className="text-label-lg text-on-surface-variant">{result.comments.length} comments</span>
        </div>

        <ul className="space-y-4">
          {result.comments.map((comment, index) => (
            <li key={index} className="border-outline-variant overflow-hidden rounded-xl border">
              <p className="bg-surface-container-low text-body-md text-on-surface px-4 py-2.5 font-semibold">
                {comment.section}
              </p>
              <dl className="text-body-md space-y-3 p-4">
                <div>
                  <dt className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
                    In your CV
                  </dt>
                  <dd className="text-on-surface-variant mt-1 italic">&ldquo;{comment.quote}&rdquo;</dd>
                </div>
                <div>
                  <dt className="text-label-md text-error font-semibold tracking-wider uppercase">Issue</dt>
                  <dd className="text-on-surface mt-1">{comment.problem}</dd>
                </div>
                <div className="bg-primary-light rounded-lg p-3">
                  <dt className="text-label-md text-primary font-semibold tracking-wider uppercase">
                    Suggested rewrite (STAR)
                  </dt>
                  <dd className="text-on-surface mt-1">{comment.fix}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" aria-hidden />}>
            Review again
          </Button>
        </div>
      </section>
    </div>
  );
}
