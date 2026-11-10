'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useBlockConversation } from '@/hooks/useRecruiterConnect';
import { getErrorMessage } from '@/utils/error';
import { toast } from 'sonner';

type BlockConversationDialogProps = {
  connectionId: number;
  onClose: () => void;
};

export default function BlockConversationDialog({ connectionId, onClose }: BlockConversationDialogProps) {
  const block = useBlockConversation(connectionId);

  const handleConfirm = () => {
    block.mutate(undefined, {
      onSuccess: () => {
        toast.success('Conversation blocked.');
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
      title="Block conversation?"
      description="Both parties will no longer be able to send new messages. Current chat history is preserved and accessible."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={block.isPending}>
            Block
          </Button>
        </>
      }
    >
      <p className="text-body-sm text-on-surface-variant">
        You may consider reporting this conversation if there is a severe violation.
      </p>
    </Modal>
  );
}
