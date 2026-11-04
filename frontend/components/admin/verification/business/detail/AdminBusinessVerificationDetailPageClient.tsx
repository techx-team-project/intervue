'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';
import { AdminBusinessVerificationDetailView } from './AdminBusinessVerificationDetailView';

interface AdminBusinessVerificationDetailPageClientProps {
  documentId: number;
}

export default function AdminBusinessVerificationDetailPageClient({
  documentId,
}: AdminBusinessVerificationDetailPageClientProps) {
  const load = useCallback(() => adminBusinessVerificationApi.getDetail(documentId), [documentId]);

  const { data, status, error, reload } = useAdminResource(load);

  if (status === 'error' && error?.status === 404) {
    notFound();
  }

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminBusinessVerificationDetailView initialDetail={data} />}
    </AdminDataGate>
  );
}
