'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useJobQuota, useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { JOB_MAX_DEADLINE_DAYS } from '@/schemas/job.schema';
import { isoDateAfterDays, todayIsoDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { defaultDeadline } from '@/utils/recruiter-job';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface RenewJobModalProps {
  job: RecruiterJobPost | null;
  onClose: () => void;
}

export default function RenewJobModal({ job, onClose }: RenewJobModalProps) {
  const [deadline, setDeadline] = useState(defaultDeadline);
  const { renew } = useRecruiterJobMutations();
  const { data: quota } = useJobQuota();
  const outOfSlots = quota !== undefined && quota.slotRequired && quota.slotsRemaining === 0;

  const submit = () => {
    if (!job) return;
    renew.mutate(
      { id: Number(job.id), deadline },
      {
        onSuccess: () => {
          toast.success('Job post renewed and reposted.');
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
      title="Renew / Repost job post"
      description={
        job ? `"${job.title}" will be visible again with the new deadline. Existing applications are kept.` : undefined
      }
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={renew.isPending} disabled={outOfSlots || !deadline}>
            Renew
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          type="date"
          label="New application deadline"
          min={todayIsoDate()}
          max={isoDateAfterDays(JOB_MAX_DEADLINE_DAYS)}
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />

        {quota && quota.slotsRemaining > 0 && (
          <p className="text-body-sm text-on-surface-variant">
            Renewing uses 1 posting slot ({quota.slotsRemaining} remaining).
          </p>
        )}
        {outOfSlots && (
          <p className="text-body-sm rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
            You have no posting slots left.{' '}
            <Link href={ROUTES.RECRUITER_SERVICES} className="font-semibold underline">
              Buy more services
            </Link>{' '}
            to renew.
          </p>
        )}
      </div>
    </Modal>
  );
}
