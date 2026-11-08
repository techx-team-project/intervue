'use client';

import { Button } from '@/components/ui/Button';
import { CANDIDATE_APPLICATION_STATUS_LABELS, WITHDRAWABLE_STATUSES } from '@/constants/candidate-application';
import { useApplicationMutations } from '@/hooks/useCandidateApplication';
import type { CandidateApplication } from '@/types/candidate-application';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ApplySubmittedViewProps {
  application: CandidateApplication;
}

export default function ApplySubmittedView({ application }: ApplySubmittedViewProps) {
  const { withdraw } = useApplicationMutations(application.jobId);
  const canWithdraw = WITHDRAWABLE_STATUSES.includes(application.status);

  const handleWithdraw = () => {
    withdraw.mutate(application.id, {
      onSuccess: () => toast.success('Đã rút hồ sơ ứng tuyển.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <div className="space-y-4 py-2 text-center">
      <div className="bg-primary-container text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full">
        <CheckCircle2 className="h-8 w-8" aria-hidden />
      </div>
      <div className="space-y-1">
        <h4 className="text-on-surface text-lg font-bold">{CANDIDATE_APPLICATION_STATUS_LABELS[application.status]}</h4>
        {application.submittedAt && (
          <p className="text-on-surface-variant text-xs">Nộp ngày {formatDate(application.submittedAt)}</p>
        )}
      </div>

      {application.cv && (
        <p className="bg-surface-container-low text-on-surface-variant mx-auto flex max-w-xs items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs">
          <FileText className="text-outline h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">{application.cv.fileName}</span>
        </p>
      )}

      {canWithdraw && (
        <Button variant="outline" size="sm" isLoading={withdraw.isPending} onClick={handleWithdraw}>
          Rút hồ sơ
        </Button>
      )}
    </div>
  );
}
