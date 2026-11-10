'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import { Button } from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Đang chờ quản trị viên xem xét',
  APPROVED: 'Đã duyệt hoàn tiền',
  REJECTED: 'Đã từ chối hoàn tiền',
};

interface OrderRefundPanelProps {
  code: string;
  onRequested: () => void;
}

export default function OrderRefundPanel({ code, onRequested }: OrderRefundPanelProps) {
  const quote = useQuery({
    queryKey: ['recruiter', 'orders', code, 'refund'],
    queryFn: () => recruiterOrderApi.refundQuote(code),
  });

  const [reason, setReason] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (quote.isPending || quote.isError) return null;

  const data = quote.data;
  if (data.existingStatus === null && !data.requestable) return null;

  const send = async () => {
    setIsSending(true);
    setError(null);
    try {
      await recruiterOrderApi.requestRefund(code, reason.trim());
      setReason('');
      await quote.refetch();
      onRequested();
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="border-outline-variant space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
      <h3 className="text-on-surface flex items-center gap-2 text-sm font-bold">
        <RotateCcw className="h-4 w-4 text-amber-600" aria-hidden />
        Hoàn tiền
      </h3>

      {data.existingStatus ? (
        <p className="text-on-surface-variant text-sm">{STATUS_LABEL[data.existingStatus]}</p>
      ) : (
        <>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            Chỉ hoàn phần dịch vụ <strong>chưa kích hoạt</strong>. Dịch vụ đã áp lên tin coi như đã dùng và vẫn chạy hết
            hạn. Số hoàn được của đơn này:{' '}
            <strong className="text-on-surface">{formatServicePrice(data.refundableAmount, 'VND')}</strong> trên tổng{' '}
            {formatServicePrice(data.orderTotal, 'VND')}.
          </p>

          <Textarea
            label="Lý do"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Cho biết vì sao bạn muốn hoàn khoản này"
          />

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

          <Button size="sm" disabled={reason.trim().length === 0} isLoading={isSending} onClick={send}>
            Gửi yêu cầu hoàn tiền
          </Button>

          <p className="text-on-surface-variant text-[11px]">
            Tiền được chuyển tay qua ngân hàng sau khi quản trị viên duyệt, hệ thống không tự chuyển.
          </p>
        </>
      )}
    </section>
  );
}
