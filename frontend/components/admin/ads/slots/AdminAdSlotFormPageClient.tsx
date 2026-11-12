'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { adminAdApi } from '@/apiRequest/ads';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminAdSlotForm from '@/components/admin/ads/slots/AdminAdSlotForm';
import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { adminAdKeys } from '@/lib/admin-ads';
import { adminServicePackageKeys } from '@/lib/admin-service-packages';
import { isApiError } from '@/lib/api-error';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminAdSlotFormPageClientProps {
  slotId?: number;
}

export default function AdminAdSlotFormPageClient({ slotId }: AdminAdSlotFormPageClientProps) {
  const isEditing = slotId !== undefined;
  const isValidId = !isEditing || (Number.isFinite(slotId) && slotId > 0);

  const slotsQuery = useQuery({
    queryKey: adminAdKeys.slots(),
    queryFn: () => adminAdApi.slots(),
    enabled: isEditing && isValidId,
  });

  const packagesQuery = useQuery({
    queryKey: adminServicePackageKeys.list({ page: 0, size: 100, sort: 'displayOrder,asc' }),
    queryFn: () => adminServicePackageApi.searchPackages({ page: 0, size: 100, sort: 'displayOrder,asc' }),
    enabled: !isEditing,
  });

  const editingSlot = isEditing ? slotsQuery.data?.find((slot) => slot.id === slotId) : undefined;
  const isNotFound = !isValidId || (isEditing && slotsQuery.isSuccess && !editingSlot);

  if (isNotFound) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white px-6 py-16 text-center shadow-xs">
        <AlertCircle className="text-outline h-10 w-10" />
        <p className="text-navy dark:text-forest-50 text-body-md font-bold">Ad slot not found</p>
        <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
          This ad slot may not exist or the URL ID is invalid.
        </p>
        <Link href={ROUTES.ADMIN_ADS_SLOTS} className={buttonClassName({ size: 'md' })}>
          Back to ad slots
        </Link>
      </div>
    );
  }

  const isLoading = (isEditing && slotsQuery.isPending) || (!isEditing && packagesQuery.isPending);
  const firstError = (isEditing ? slotsQuery.error : null) ?? (!isEditing ? packagesQuery.error : null);
  const gateStatus = isLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  return (
    <AdminDataGate
      status={gateStatus}
      error={gateError}
      onRetry={() => {
        if (isEditing) void slotsQuery.refetch();
        else void packagesQuery.refetch();
      }}
    >
      {(!isEditing ? packagesQuery.data : editingSlot) && (
        <AdminAdSlotForm
          key={slotId ?? 'new'}
          servicePackages={packagesQuery.data?.items ?? []}
          editingSlot={editingSlot}
        />
      )}
    </AdminDataGate>
  );
}
