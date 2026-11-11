'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCandidateBlock } from '@/hooks/useCandidateConnect';
import { getErrorMessage } from '@/utils/error';
import { toast } from 'sonner';

type CandidateBlockConversationDialogProps = {
  connectionId: number;
  onClose: () => void;
};

export default function CandidateBlockConversationDialog({
  connectionId,
  onClose,
}: CandidateBlockConversationDialogProps) {
  const block = useCandidateBlock(connectionId);

  const handleConfirm = () => {
    block.mutate(undefined, {
      onSuccess: () => {
        toast.success('Conversation has been blocked.');
        onClose();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="sm"
      radius="md"
      title="Block conversation?"
      description="Neither party will be able to send new messages. Existing chat history is preserved and viewable as normal."
      footer={
        <>
          <Button variant="outline" radius="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" radius="md" onClick={handleConfirm} isLoading={block.isPending}>
            Block
          </Button>
        </>
      }
    >
      <p className="text-body-sm text-on-surface-variant">
        You can also report this conversation if there is a severe guideline violation.
      </p>
    </Modal>
  );
}
