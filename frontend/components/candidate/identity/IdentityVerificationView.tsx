'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { useIdentityVerification, useRequestManualIdentityReview } from '@/hooks/useIdentityVerification';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import IdentityVerificationForm from './IdentityVerificationForm';

function StatusCard({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: 'success' | 'warning' | 'danger';
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
}) {
  const toneClass = {
    success: 'border-primary/30 bg-primary-light text-primary',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-error/30 bg-error/10 text-error',
  }[tone];

  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${toneClass}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-bold">{title}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

export default function IdentityVerificationView() {
  const { data, isLoading, isError, error, refetch } = useIdentityVerification();
  const manualReview = useRequestManualIdentityReview();

  const requestManualReview = () =>
    manualReview.mutate(undefined, {
      onSuccess: () => toast.success('Request sent. An admin will review your submission.'),
      onError: (failure) => toast.error(getErrorMessage(failure)),
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl space-y-5 py-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">Identity verification</h1>
        <p className="mt-1 text-sm text-slate-500">
          You need to verify your identity with your ID card before applying. This helps recruiters trust your
          application.
        </p>
      </header>

      {data.status === 'APPROVED' && (
        <StatusCard tone="success" icon={CheckCircle2} title="Your account is verified">
          {data.reviewedAt && <p>Approved on {formatDateTime(data.reviewedAt)}. You can apply right away.</p>}
        </StatusCard>
      )}

      {data.status === 'PENDING' && (
        <StatusCard tone="warning" icon={Clock} title="Your submission is under review">
          <p>
            Submitted on {data.submittedAt ? formatDateTime(data.submittedAt) : ''}. Review usually takes up to 24
            working hours and you will be notified of the result.
          </p>
        </StatusCard>
      )}

      {data.status === 'REJECTED' && (
        <StatusCard tone="danger" icon={ShieldAlert} title="Your submission was not approved">
          <p>Reason: {data.rejectReason}</p>
          <p>
            {data.canSubmit
              ? `You have ${data.attemptsLeft} attempt(s) left.`
              : 'You have used all your attempts. Request a manual review by an admin.'}
          </p>
          {data.canRequestManualReview && (
            <Button size="sm" className="mt-2" disabled={manualReview.isPending} onClick={requestManualReview}>
              {manualReview.isPending ? 'Sending...' : 'Request manual review'}
            </Button>
          )}
          {data.manualReviewRequestedAt && (
            <p className="font-semibold">
              Manual review requested on {formatDateTime(data.manualReviewRequestedAt)}. We will reply soon.
            </p>
          )}
        </StatusCard>
      )}

      {(!data.status || (data.status === 'REJECTED' && data.canSubmit)) && (
        <div className="bg-surface rounded-2xl p-5 shadow-2xs">
          <IdentityVerificationForm initialName={data.fullName} />
        </div>
      )}
    </div>
  );
}
