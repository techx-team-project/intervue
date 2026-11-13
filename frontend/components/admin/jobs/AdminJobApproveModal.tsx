'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { AdminJobSummaryResource } from '@/types/admin-job';

interface AdminJobApproveModalProps {
  job: AdminJobSummaryResource | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminJobApproveModal({ job, isPending, onClose, onConfirm }: AdminJobApproveModalProps) {
  return (
    <Modal
      isOpen={job !== null}
      onClose={onClose}
      maxWidth="sm"
      title="Approve this job?"
      description={job ? `"${job.title}" goes live for candidates right away.` : undefined}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button isLoading={isPending} onClick={onConfirm}>
            Approve
          </Button>
        </div>
      }
    >
      <p className="text-on-surface-variant text-sm">The recruiter is notified when the job is approved.</p>
    </Modal>
  );
}
