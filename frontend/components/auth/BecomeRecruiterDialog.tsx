'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useBecomeRecruiter } from '@/hooks/useBecomeRecruiter';
import { useResendVerification } from '@/hooks/useResendVerification';

type BecomeRecruiterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BecomeRecruiterDialog({ isOpen, onClose }: BecomeRecruiterDialogProps) {
  const { user } = useAuth();
  const becomeRecruiter = useBecomeRecruiter();
  const resend = useResendVerification();
  const emailVerified = user?.emailVerified ?? false;

  const footer = emailVerified ? (
    <>
      <Button variant="ghost" onClick={onClose} disabled={becomeRecruiter.isPending}>
        Để sau
      </Button>
      <Button
        isLoading={becomeRecruiter.isPending}
        onClick={() => becomeRecruiter.mutate(undefined, { onSuccess: onClose })}
      >
        Trở thành nhà tuyển dụng
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" onClick={onClose}>
        Đóng
      </Button>
      <Button isLoading={resend.isPending} onClick={() => resend.mutate()}>
        Gửi lại email xác minh
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trở thành nhà tuyển dụng" footer={footer}>
      {emailVerified ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Tài khoản của bạn sẽ có thêm vai trò Nhà tuyển dụng để đăng tin và quản lý hồ sơ ứng tuyển. Các vai trò hiện
          có vẫn được giữ nguyên và bạn có thể chuyển qua lại bất cứ lúc nào.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-slate-600">
          Bạn cần xác minh email <strong>{user?.email}</strong> trước khi bật vai trò Nhà tuyển dụng. Hãy kiểm tra hộp
          thư hoặc gửi lại email xác minh.
        </p>
      )}
    </Modal>
  );
}
