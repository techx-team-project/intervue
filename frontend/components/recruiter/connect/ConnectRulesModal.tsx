'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAcknowledgeRules } from '@/hooks/useRecruiterConnect';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';

const RULES = [
  'Phiên bản hiện tại là phiên bản thử nghiệm nên trong quá trình sử dụng có thể gặp lỗi hoặc một số tính năng có thể không hoạt động đúng cách.',
  'Tài khoản nhà tuyển dụng được gửi tối đa 100 cuộc hội thoại mới mỗi ngày. Ứng viên có thể chấp nhận hoặc từ chối lời mời trò chuyện bất cứ lúc nào.',
  'Lịch sự khi tương tác, trao đổi. Không gửi hoặc tạo điều kiện cho việc truyền nội dung không phù hợp, số lượng lớn tin nhắn thương mại hay tự động.',
  'Không dùng tính năng InterVue Connect để thực hiện hành vi lừa đảo (hoặc có dấu hiệu lừa đảo).',
  'Không yêu cầu hoặc thu thập dữ liệu nhạy cảm. Không mạo danh người khác. Không cung cấp thông tin không đúng về bản thân. Không dùng InterVue Connect để quấy rối, đe doạ hoặc dọa dẫm người khác.',
  'Không cho phép lan truyền phần mềm độc hại, vi-rút, Trojan horse, tệp hỏng hay bất cứ thứ gì có thể gây hại hoặc can thiệp vào hoạt động của hệ thống InterVue hay tổ chức khác.',
  'InterVue có thể vô hiệu hoá những tài khoản bị phát hiện vi phạm các quy định này.',
];

type ConnectRulesModalProps = {
  mode: 'gate' | 'view';
  onClose: () => void;
};

export default function ConnectRulesModal({ mode, onClose }: ConnectRulesModalProps) {
  const [agreed, setAgreed] = useState(false);
  const acknowledge = useAcknowledgeRules();

  const handleAgree = () => {
    acknowledge.mutate(undefined, {
      onSuccess: onClose,
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Modal
      isOpen
      onClose={mode === 'view' ? onClose : () => {}}
      showCloseButton={mode === 'view'}
      maxWidth="2xl"
      title="Quy định sử dụng tính năng InterVue Connect"
      footer={
        mode === 'gate' ? (
          <Button onClick={handleAgree} disabled={!agreed} isLoading={acknowledge.isPending} className="w-full">
            Tôi đồng ý
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        )
      }
    >
      <ol className="space-y-3.5">
        {RULES.map((rule, index) => (
          <li key={rule} className="flex gap-3">
            <span className="bg-primary-light text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {index + 1}
            </span>
            <p className="text-body-md text-on-surface">{rule}</p>
          </li>
        ))}
      </ol>

      {mode === 'gate' && (
        <label className="mt-5 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="accent-primary mt-0.5"
          />
          <span className="text-body-sm text-on-surface">
            Tôi đồng ý với các quy định và hoàn toàn chịu trách nhiệm nếu vi phạm
          </span>
        </label>
      )}
    </Modal>
  );
}
