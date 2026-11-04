import { CompanyVerificationView } from '@/components/recruiter/company/CompanyVerificationView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Verification & Trust | InterVue',
  description: 'Manage enterprise credentials, legal documents, and verification level on InterVue.',
};

export const dynamic = 'force-dynamic';

export default function CompanyVerificationPage() {
  return <CompanyVerificationView />;
}
