'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { adminVoucherApi } from '@/apiRequest/voucher';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminVoucherForm from '@/components/admin/services/vouchers/AdminVoucherForm';
import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { adminServicePackageKeys } from '@/lib/admin-service-packages';
import { adminVoucherKeys } from '@/lib/admin-vouchers';
import { isApiError } from '@/lib/api-error';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminVoucherFormPageClientProps {
  voucherId?: number;
}

export default function AdminVoucherFormPageClient({ voucherId }: AdminVoucherFormPageClientProps) {
  const isEditing = voucherId !== undefined;
  const isValidId = !isEditing || (Number.isFinite(voucherId) && voucherId > 0);

  const packagesQuery = useQuery({
    queryKey: adminServicePackageKeys.list({ page: 0, size: 100, sort: 'displayOrder,asc' }),
    queryFn: () => adminServicePackageApi.searchPackages({ page: 0, size: 100, sort: 'displayOrder,asc' }),
    enabled: isValidId,
  });

  const voucherQuery = useQuery({
    queryKey: adminVoucherKeys.detail(voucherId ?? 0),
    queryFn: () => adminVoucherApi.getById(voucherId!),
    enabled: isEditing && isValidId,
    retry: false,
  });

  const isNotFound =
    !isValidId ||
    (isEditing &&
      isApiError(voucherQuery.error) &&
      (voucherQuery.error.status === 404 || voucherQuery.error.code === 'VOUCHER_NOT_FOUND'));

  if (isNotFound) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white px-6 py-16 text-center shadow-xs">
        <AlertCircle className="text-outline h-10 w-10" />
        <p className="text-navy dark:text-forest-50 text-body-md font-bold">Voucher not found</p>
        <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
          This voucher may have been removed or the URL ID is invalid.
        </p>
        <Link href={ROUTES.ADMIN_SERVICE_VOUCHERS} className={buttonClassName({ size: 'md' })}>
          Back to vouchers
        </Link>
      </div>
    );
  }

  const isLoading = packagesQuery.isPending || (isEditing && voucherQuery.isPending);
  const firstError = packagesQuery.error ?? (isEditing ? voucherQuery.error : null);
  const gateStatus = isLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  return (
    <AdminDataGate
      status={gateStatus}
      error={gateError}
      onRetry={() => {
        void packagesQuery.refetch();
        if (isEditing) void voucherQuery.refetch();
      }}
    >
      {packagesQuery.data && (!isEditing || voucherQuery.data) && (
        <AdminVoucherForm
          key={voucherId ?? 'new'}
          servicePackages={packagesQuery.data.items}
          editingVoucher={voucherQuery.data}
        />
      )}
    </AdminDataGate>
  );
}
