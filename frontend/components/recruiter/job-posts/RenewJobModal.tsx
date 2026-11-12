'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useJobQuota, useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { todayIsoDate } from '@/utils/datetime';
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
          toast.success('Đã gia hạn và đăng lại tin.');
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
      title="Gia hạn / Đăng lại tin"
      description={job ? `"${job.title}" sẽ hiển thị lại với hạn nộp mới. Hồ sơ cũ được giữ nguyên.` : undefined}
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={submit} isLoading={renew.isPending} disabled={outOfSlots || !deadline}>
            Gia hạn
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          type="date"
          label="Hạn nộp hồ sơ mới"
          min={todayIsoDate()}
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />

        {quota && quota.slotsRemaining > 0 && (
          <p className="text-body-sm text-on-surface-variant">
            Gia hạn sẽ dùng 1 lượt đăng tin (còn {quota.slotsRemaining} lượt).
          </p>
        )}
        {outOfSlots && (
          <p className="text-body-sm rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
            Bạn đã hết lượt đăng tin.{' '}
            <Link href={ROUTES.RECRUITER_SERVICES} className="font-semibold underline">
              Mua thêm dịch vụ
            </Link>{' '}
            để gia hạn.
          </p>
        )}
      </div>
    </Modal>
  );
}
