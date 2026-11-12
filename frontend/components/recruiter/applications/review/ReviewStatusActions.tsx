'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { REVIEW_ACTION_LABELS } from '@/constants/application-review';
import { useReviewMutations } from '@/hooks/useRecruiterApplications';
import type { ReviewApplication } from '@/types/application-review';
import type { CandidateApplicationStatus } from '@/types/candidate-application';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewStatusActionsProps {
  application: ReviewApplication;
}

export default function ReviewStatusActions({ application }: ReviewStatusActionsProps) {
  const { changeStatus } = useReviewMutations(application.id);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');

  const move = (status: CandidateApplicationStatus, text?: string) => {
    changeStatus.mutate(
      { status, note: text },
      {
        onSuccess: () => {
          toast.success('Application status updated.');
          setRejecting(false);
          setNote('');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const statuses = application.nextStatuses.filter((status) => status !== 'INTERVIEW');

  if (statuses.length === 0) {
    return <p className="text-xs text-slate-500">This application has no further steps.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={status === 'REJECTED' ? 'danger' : status === 'HIRED' ? 'primary' : 'outline'}
            isLoading={changeStatus.isPending && changeStatus.variables?.status === status}
            disabled={changeStatus.isPending}
            onClick={() => (status === 'REJECTED' ? setRejecting(true) : move(status))}
          >
            {REVIEW_ACTION_LABELS[status] ?? status}
          </Button>
        ))}
      </div>

      <Modal
        isOpen={rejecting}
        onClose={() => setRejecting(false)}
        maxWidth="md"
        title="Reject this application?"
        description="The candidate will be notified that their application was not a fit. The note below is internal only."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejecting(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={changeStatus.isPending} onClick={() => move('REJECTED', note)}>
              Reject
            </Button>
          </div>
        }
      >
        <Textarea
          label="Reason (internal, optional)"
          value={note}
          rows={3}
          maxLength={500}
          onChange={(event) => setNote(event.target.value)}
        />
      </Modal>
    </>
  );
}
