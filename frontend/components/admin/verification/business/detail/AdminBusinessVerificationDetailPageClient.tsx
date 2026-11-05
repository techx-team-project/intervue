'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import { AdminBusinessVerificationDetailView } from './AdminBusinessVerificationDetailView';

interface AdminBusinessVerificationDetailPageClientProps {
  documentId: number;
}

export default function AdminBusinessVerificationDetailPageClient({
  documentId,
}: AdminBusinessVerificationDetailPageClientProps) {
  const load = useCallback(async () => {
    return await adminBusinessVerificationApi.getDetail(documentId);
  }, [documentId]);

  const { data: detail, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {detail && <AdminBusinessVerificationDetailView dossierId={documentId} liveDetail={detail} onRefresh={reload} />}
    </AdminDataGate>
  );
}
