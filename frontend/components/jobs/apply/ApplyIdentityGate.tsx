import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import type { IdentityVerificationResource } from '@/types/identity-verification';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function messageFor(identity: IdentityVerificationResource) {
  if (identity.status === 'PENDING') {
    return 'Hồ sơ xác thực của bạn đang chờ duyệt (dự kiến trong 24 giờ làm việc). Bạn sẽ ứng tuyển được ngay khi được duyệt.';
  }
  if (identity.status === 'REJECTED') {
    return identity.canSubmit
      ? `Hồ sơ xác thực chưa được duyệt: ${identity.rejectReason}. Hãy gửi lại để ứng tuyển.`
      : 'Hồ sơ xác thực chưa được duyệt và bạn đã hết lượt gửi lại. Bạn có thể yêu cầu quản trị viên duyệt thủ công.';
  }
  return 'Bạn cần xác thực danh tính bằng CCCD trước khi ứng tuyển. Chỉ mất vài phút.';
}

export default function ApplyIdentityGate({ identity }: { identity: IdentityVerificationResource }) {
  const actionLabel = identity.status === 'PENDING' ? 'Xem trạng thái' : 'Xác thực danh tính';

  return (
    <div className="space-y-4 py-6 text-center">
      <ShieldCheck className="text-primary mx-auto h-10 w-10" aria-hidden />
      <p className="text-on-surface-variant mx-auto max-w-sm text-sm">{messageFor(identity)}</p>
      <Link href={ROUTES.CANDIDATE_IDENTITY_VERIFICATION}>
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}
