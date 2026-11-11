'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

type DeclineInvitationDialogProps = {
  companyName: string;
  inviteCount?: number;
  maxInvites?: number;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeclineInvitationDialog({
  companyName,
  inviteCount,
  maxInvites,
  isLoading,
  onConfirm,
  onClose,
}: DeclineInvitationDialogProps) {
  const resolvedInviteCount = inviteCount ?? 1;
  const resolvedMaxInvites = maxInvites ?? 2;
  const isFinalAttempt = resolvedInviteCount >= resolvedMaxInvites;

  return (
    <Modal
      isOpen
      onClose={isLoading ? () => {} : onClose}
      maxWidth="sm"
      radius="md"
      title="Decline invitation?"
      description={`You are about to decline this chat invitation from ${companyName}.`}
      footer={
        <>
          <Button variant="outline" radius="md" disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" radius="md" onClick={onConfirm} isLoading={isLoading}>
            Decline
          </Button>
        </>
      }
    >
      <p className="text-body-sm text-on-surface-variant leading-relaxed">
        {isFinalAttempt
          ? `This is the recruiter's final invitation. Once declined, ${companyName} will not be able to invite you again.`
          : 'Once declined, this conversation will stay closed unless the recruiter sends one final invitation after 24 hours.'}
      </p>
    </Modal>
  );
}
