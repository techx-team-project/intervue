'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useRecruiterJobList } from '@/hooks/useRecruiterJobs';
import type { Entitlement } from '@/types/entitlement';
import type { EntitlementType } from '@/types/service-package';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ActivateEntitlementModalProps {
  entitlement: Entitlement | null;
  onClose: () => void;
  onConfirm: (jobId?: number) => void;
  isBusy: boolean;
  error: string | null;
}

const COMPANY_LEVEL: EntitlementType[] = ['BRAND_PAGE', 'FEATURED_COMPANY'];

export default function ActivateEntitlementModal({
  entitlement,
  onClose,
  onConfirm,
  isBusy,
  error,
}: ActivateEntitlementModalProps) {
  const onCompany = entitlement !== null && COMPANY_LEVEL.includes(entitlement.entitlementType);
  const isRetop = entitlement?.entitlementType === 'JOB_RETOP';
  const { data } = useRecruiterJobList({ status: 'PUBLISHED', page: 0, size: 100 });
  const [jobId, setJobId] = useState('');

  const options = [
    { value: '', label: '— Chọn tin tuyển dụng —' },
    ...(data?.items ?? []).map((job) => ({ value: String(job.id), label: job.title })),
  ];

  const modalTitle = onCompany
    ? 'Kích hoạt dịch vụ cho công ty'
    : isRetop
      ? 'Đẩy top tin tuyển dụng'
      : 'Áp dụng dịch vụ cho tin tuyển dụng';

  return (
    <Modal isOpen={entitlement !== null} onClose={onClose} title={modalTitle} maxWidth="lg">
      {entitlement && (
        <>
          <p className="text-on-surface-variant text-sm">
            Dịch vụ: <strong className="text-on-surface">{entitlement.label}</strong> · còn{' '}
            {entitlement.remainingQuantity}
            {entitlement.durationDays ? ` · hiệu lực ${entitlement.durationDays} ngày` : ''}
          </p>

          {onCompany ? (
            <p className="text-on-surface-variant mt-4 text-sm">
              Dịch vụ này áp dụng cho toàn bộ công ty, không gắn với một tin tuyển dụng cụ thể.
            </p>
          ) : (
            <div className="mt-4">
              <Select
                label="Tin tuyển dụng đang chạy"
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
                options={options}
              />
              {(data?.items ?? []).length === 0 && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  Bạn chưa có tin nào đang hiển thị. Hãy đăng tin trước khi áp dụng dịch vụ này.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-900">
              {isRetop ? (
                <>
                  Tin tuyển dụng được chọn sẽ lên đầu danh sách ngay lập tức và <strong>trừ 1 lượt đẩy top</strong>.
                </>
              ) : (
                <>
                  Đã áp dụng thì <strong>không gỡ ra được</strong>. Thời gian hiệu lực bắt đầu tính từ lúc này.
                </>
              )}
            </p>
          </div>

          {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="neutral" onClick={onClose}>
              Huỷ
            </Button>
            <Button
              onClick={() => onConfirm(onCompany ? undefined : Number(jobId))}
              disabled={!onCompany && !jobId}
              isLoading={isBusy}
            >
              {isRetop ? 'Đẩy top ngay' : 'Xác nhận áp dụng'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
