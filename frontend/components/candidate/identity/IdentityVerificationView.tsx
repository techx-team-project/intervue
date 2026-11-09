'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { useIdentityVerification, useRequestManualIdentityReview } from '@/hooks/useIdentityVerification';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import IdentityVerificationForm from './IdentityVerificationForm';

function StatusCard({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: 'success' | 'warning' | 'danger';
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
}) {
  const toneClass = {
    success: 'border-primary/30 bg-primary-light text-primary',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-error/30 bg-error/10 text-error',
  }[tone];

  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${toneClass}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-bold">{title}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

export default function IdentityVerificationView() {
  const { data, isLoading, isError, error, refetch } = useIdentityVerification();
  const manualReview = useRequestManualIdentityReview();

  const requestManualReview = () =>
    manualReview.mutate(undefined, {
      onSuccess: () => toast.success('Đã gửi yêu cầu. Quản trị viên sẽ xem xét hồ sơ của bạn.'),
      onError: (failure) => toast.error(getErrorMessage(failure)),
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
        <Button variant="outline" onClick={() => refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl space-y-5 py-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">Xác thực danh tính</h1>
        <p className="mt-1 text-sm text-slate-500">
          Bạn cần xác thực danh tính bằng CCCD trước khi ứng tuyển. Việc này giúp nhà tuyển dụng tin tưởng hồ sơ của
          bạn.
        </p>
      </header>

      {data.status === 'APPROVED' && (
        <StatusCard tone="success" icon={CheckCircle2} title="Tài khoản đã được xác thực">
          {data.reviewedAt && <p>Duyệt lúc {formatDateTime(data.reviewedAt)}. Bạn có thể ứng tuyển ngay.</p>}
        </StatusCard>
      )}

      {data.status === 'PENDING' && (
        <StatusCard tone="warning" icon={Clock} title="Hồ sơ đang chờ duyệt">
          <p>
            Hồ sơ gửi lúc {data.submittedAt ? formatDateTime(data.submittedAt) : ''}. Thời gian xử lý dự kiến trong 24
            giờ làm việc, bạn sẽ nhận thông báo khi có kết quả.
          </p>
        </StatusCard>
      )}

      {data.status === 'REJECTED' && (
        <StatusCard tone="danger" icon={ShieldAlert} title="Hồ sơ chưa được duyệt">
          <p>Lý do: {data.rejectReason}</p>
          <p>
            {data.canSubmit
              ? `Bạn còn ${data.attemptsLeft} lượt gửi lại.`
              : 'Bạn đã dùng hết lượt gửi lại. Hãy gửi yêu cầu để quản trị viên xét duyệt thủ công.'}
          </p>
          {data.canRequestManualReview && (
            <Button size="sm" className="mt-2" disabled={manualReview.isPending} onClick={requestManualReview}>
              {manualReview.isPending ? 'Đang gửi...' : 'Yêu cầu duyệt thủ công'}
            </Button>
          )}
          {data.manualReviewRequestedAt && (
            <p className="font-semibold">
              Đã gửi yêu cầu duyệt thủ công lúc {formatDateTime(data.manualReviewRequestedAt)}. Chúng tôi sẽ phản hồi
              sớm.
            </p>
          )}
        </StatusCard>
      )}

      {(!data.status || (data.status === 'REJECTED' && data.canSubmit)) && (
        <div className="bg-surface rounded-2xl p-5 shadow-2xs">
          <IdentityVerificationForm initialName={data.fullName} />
        </div>
      )}
    </div>
  );
}
