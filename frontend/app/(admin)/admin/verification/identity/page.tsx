import AdminIdentityVerificationView from '@/components/admin/verification/identity/AdminIdentityVerificationView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Identity Verification | InterVue Admin',
  description: 'Review candidate identity documents.',
};

export default function AdminIdentityVerificationPage() {
  return <AdminIdentityVerificationView />;
}
