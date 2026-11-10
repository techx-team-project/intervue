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
        toast.success('Đã chặn cuộc trò chuyện.');
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
      title="Chặn cuộc trò chuyện?"
      description="Cả hai bên sẽ không thể gửi tin nhắn mới. Lịch sử trò chuyện hiện tại vẫn được giữ lại và xem được như bình thường."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={block.isPending}>
            Chặn
          </Button>
        </>
      }
    >
      <p className="text-body-sm text-on-surface-variant">
        Bạn có thể cân nhắc báo cáo nếu đây là vi phạm nghiêm trọng.
      </p>
    </Modal>
  );
}
