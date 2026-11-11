'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdminIdentityVerifications } from '@/hooks/useIdentityVerification';
import { cn } from '@/lib/utils';
import type { AdminIdentityVerificationResource, IdentityVerificationStatus } from '@/types/identity-verification';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import AdminIdentityReviewModal from './AdminIdentityReviewModal';

const PAGE_SIZE = 10;

const TABS: Array<{ value: IdentityVerificationStatus | undefined; label: string }> = [
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: undefined, label: 'Tất cả' },
];

const STATUS_BADGE: Record<IdentityVerificationStatus, { label: string; variant: 'warning' | 'success' | 'danger' }> = {
  PENDING: { label: 'Chờ duyệt', variant: 'warning' },
  APPROVED: { label: 'Đã duyệt', variant: 'success' },
  REJECTED: { label: 'Đã từ chối', variant: 'danger' },
};

export default function AdminIdentityVerificationView() {
  const [status, setStatus] = useState<IdentityVerificationStatus | undefined>('PENDING');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminIdentityVerificationResource | null>(null);
  const { data, isLoading, isError, error, refetch } = useAdminIdentityVerifications({
    status,
    q: keyword,
    page: page - 1,
    size: PAGE_SIZE,
  });

  return (
    <div className="space-y-5 p-4 md:p-6">
      <header>
        <h1 className="text-on-surface text-xl font-black">Xác thực danh tính ứng viên</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Xem CCCD và ảnh chân dung, sau đó duyệt hoặc từ chối kèm lý do.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                status === tab.value
                  ? 'border-primary bg-primary text-white'
                  : 'border-outline-variant text-on-surface-variant bg-white hover:bg-slate-50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Tìm theo tên hoặc 4 số cuối CCCD"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      )}
      {data && data.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
          Không có hồ sơ nào.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-4">
          <ul className="divide-outline-variant divide-y overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {data.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      {item.fullName}
                      {item.idNumberUsedByAnotherAccount && (
                        <AlertTriangle className="text-error h-4 w-4" aria-label="CCCD trùng tài khoản khác" />
                      )}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {item.userEmail} · CCCD ••••{item.idNumberLast4} · gửi {formatDateTime(item.submittedAt)}
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[item.status].variant}>{STATUS_BADGE[item.status].label}</Badge>
                  {item.manualReviewRequestedAt && <Badge variant="warning">Yêu cầu duyệt thủ công</Badge>}
                </button>
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            pageCount={data.totalPages}
            totalItems={data.totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      {selected && <AdminIdentityReviewModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
