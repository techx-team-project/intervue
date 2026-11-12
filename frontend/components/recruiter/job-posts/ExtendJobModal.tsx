'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import { JOB_MAX_DEADLINE_DAYS } from '@/schemas/job.schema';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { isoDateAfterDays, shiftIsoDate, todayIsoDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_EXTENSION_DAYS = 30;

interface ExtendJobModalProps {
  job: RecruiterJobPost | null;
  onClose: () => void;
}

function initialDeadline(job: RecruiterJobPost | null): string {
  const latest = isoDateAfterDays(JOB_MAX_DEADLINE_DAYS);
  const current = job?.expiresAt?.slice(0, 10) ?? todayIsoDate();
  const proposed = shiftIsoDate(current, DEFAULT_EXTENSION_DAYS);
  return proposed > latest ? latest : proposed;
}

export default function ExtendJobModal({ job, onClose }: ExtendJobModalProps) {
  const [deadline, setDeadline] = useState(() => initialDeadline(job));
  const { extend } = useRecruiterJobMutations();
  const currentDeadline = job?.expiresAt?.slice(0, 10);
  const earliest = shiftIsoDate(currentDeadline ?? todayIsoDate(), 1);

  const submit = () => {
    if (!job) return;
    extend.mutate(
      { id: Number(job.id), deadline },
      {
        onSuccess: () => {
          toast.success('Deadline extended.');
          onClose();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Modal
      isOpen={job !== null}
      onClose={onClose}
      title="Extend deadline"
      description={
        job
          ? `"${job.title}" keeps receiving applications until the new date. This does not use another posting slot.`
          : undefined
      }
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={extend.isPending} disabled={!deadline || deadline < earliest}>
            Extend
          </Button>
        </div>
      }
    >
      <Input
        type="date"
        label="New application deadline"
        min={earliest}
        max={isoDateAfterDays(JOB_MAX_DEADLINE_DAYS)}
        helperText={currentDeadline ? `Current deadline: ${currentDeadline}` : undefined}
        value={deadline}
        onChange={(event) => setDeadline(event.target.value)}
      />
    </Modal>
  );
}
