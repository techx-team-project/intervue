import AdminBusinessVerificationPageClient from '@/components/admin/verification/business/AdminBusinessVerificationPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Verification | InterVue Admin',
  description: 'Review corporate registration certificates and recruiter authorization letters.',
};

export default function AdminBusinessVerificationPage() {
  return <AdminBusinessVerificationPageClient />;
}
