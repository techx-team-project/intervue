'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useAdminIdentityReview } from '@/hooks/useIdentityVerification';
import type { AdminIdentityVerificationResource } from '@/types/identity-verification';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AdminIdentityImage from './AdminIdentityImage';

interface AdminIdentityReviewModalProps {
  item: AdminIdentityVerificationResource;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface text-right font-semibold">{value}</dd>
    </div>
  );
}

export default function AdminIdentityReviewModal({ item, onClose }: AdminIdentityReviewModalProps) {
  const { approve, reject, grantAttempts } = useAdminIdentityReview();
  const [reason, setReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const busy = approve.isPending || reject.isPending || grantAttempts.isPending;
  const exhausted = item.status === 'REJECTED' && item.rejectionCount >= item.attemptLimit;

  const finish = (message: string) => {
    toast.success(message);
    onClose();
  };
  const fail = (error: unknown) => toast.error(getErrorMessage(error));

  return (
    <Modal isOpen onClose={onClose} maxWidth="2xl" title={item.fullName} description={item.userEmail}>
      <div className="space-y-5">
        {item.idNumberUsedByAnotherAccount && (
          <div className="border-error/30 bg-error/10 text-error flex gap-2 rounded-xl border p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>Số CCCD này đang được dùng cho tài khoản khác. Cần xem xét kỹ trước khi duyệt.</p>
          </div>
        )}

        <dl className="space-y-1.5">
          <Row label="Số CCCD" value={`•••••••• ${item.idNumberLast4}`} />
          <Row label="Ngày sinh" value={formatDate(item.dateOfBirth)} />
          <Row label="Gửi lúc" value={formatDateTime(item.submittedAt)} />
          <Row label="Số lần bị từ chối" value={`${item.rejectionCount}/${item.attemptLimit}`} />
          {item.rejectReason && <Row label="Lý do từ chối" value={item.rejectReason} />}
        </dl>

        <div className="grid gap-3 sm:grid-cols-3">
          <AdminIdentityImage id={item.id} side="front" label="Mặt trước" />
          <AdminIdentityImage id={item.id} side="back" label="Mặt sau" />
          <AdminIdentityImage id={item.id} side="selfie" label="Chân dung" />
        </div>

        {item.status === 'PENDING' && !rejecting && (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" disabled={busy} onClick={() => setRejecting(true)}>
              Từ chối
            </Button>
            <Button
              disabled={busy}
              onClick={() =>
                approve.mutate(item.id, { onSuccess: () => finish('Đã duyệt xác thực danh tính.'), onError: fail })
              }
            >
              {approve.isPending ? 'Đang duyệt...' : 'Duyệt'}
            </Button>
          </div>
        )}

        {item.status === 'PENDING' && rejecting && (
          <div className="space-y-2">
            <Textarea
              label="Lý do từ chối (ứng viên sẽ thấy)"
              placeholder="Ví dụ: Ảnh mặt sau bị mờ, vui lòng chụp lại rõ nét."
              value={reason}
              maxLength={500}
              onChange={(event) => setReason(event.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" disabled={busy} onClick={() => setRejecting(false)}>
                Huỷ
              </Button>
              <Button
                variant="danger"
                disabled={busy || reason.trim().length === 0}
                onClick={() =>
                  reject.mutate(
                    { id: item.id, reason: reason.trim() },
                    { onSuccess: () => finish('Đã từ chối hồ sơ.'), onError: fail },
                  )
                }
              >
                {reject.isPending ? 'Đang từ chối...' : 'Xác nhận từ chối'}
              </Button>
            </div>
          </div>
        )}

        {exhausted && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-800">Ứng viên đã hết lượt gửi lại.</p>
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                grantAttempts.mutate(item.id, { onSuccess: () => finish('Đã cấp thêm 3 lượt.'), onError: fail })
              }
            >
              Cấp thêm 3 lượt
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
