import AdminBusinessVerificationDetailPageClient from '@/components/admin/verification/business/detail/AdminBusinessVerificationDetailPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dossier Review | Business Verification | InterVue Admin',
  description: 'Inspect business credentials, cross-reference company facts, and determine compliance approval.',
};

interface AdminBusinessVerificationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBusinessVerificationDetailPage({
  params,
}: AdminBusinessVerificationDetailPageProps) {
  const { id } = await params;
  return <AdminBusinessVerificationDetailPageClient documentId={Number(id)} />;
}
