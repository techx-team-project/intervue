'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import type { AdminBusinessVerificationDetailResource } from '@/types/recruiter-company';
import { useCallback } from 'react';
import { useMockVerificationStore } from '../useMockVerificationStore';
import { AdminBusinessVerificationDetailView } from './AdminBusinessVerificationDetailView';

interface AdminBusinessVerificationDetailPageClientProps {
  documentId: number;
}

export default function AdminBusinessVerificationDetailPageClient({
  documentId,
}: AdminBusinessVerificationDetailPageClientProps) {
  const { dossiers } = useMockVerificationStore();

  const load = useCallback(async () => {
    try {
      return await adminBusinessVerificationApi.getDetail(documentId);
    } catch {
      // Fallback to mock store if live DB is empty or unreachable during dev
      const mock = dossiers.find((d) => d.document.id === documentId);
      if (mock) {
        return {
          document: mock.document,
          company: mock.company,
          submitter: mock.submitter,
          members: mock.members,
          companyDocuments: [mock.document],
        } as AdminBusinessVerificationDetailResource;
      }
      throw new Error('Document not found');
    }
  }, [documentId, dossiers]);

  const { data: detail, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {detail && <AdminBusinessVerificationDetailView dossierId={documentId} liveDetail={detail} onRefresh={reload} />}
    </AdminDataGate>
  );
}
