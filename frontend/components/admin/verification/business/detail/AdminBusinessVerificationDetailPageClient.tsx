'use client';

import Spinner from '@/components/common/Spinner';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';
import { useMockVerificationStore } from '../useMockVerificationStore';
import { AdminBusinessVerificationDetailView } from './AdminBusinessVerificationDetailView';

interface AdminBusinessVerificationDetailPageClientProps {
  documentId: number;
}

export default function AdminBusinessVerificationDetailPageClient({
  documentId,
}: AdminBusinessVerificationDetailPageClientProps) {
  const { dossiers, isReady } = useMockVerificationStore();

  const dossier = useMemo(() => {
    return dossiers.find((d) => d.document.id === documentId);
  }, [dossiers, documentId]);

  if (!isReady) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!dossier) {
    notFound();
  }

  return <AdminBusinessVerificationDetailView dossierId={documentId} />;
}
