import AdminPaymentSettingsPageClient from '@/components/admin/finance/AdminPaymentSettingsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Settings | InterVue Admin',
  description: 'VAT, order expiry and the SePay bank account used for recruiter payments.',
};

export default function AdminPaymentSettingsPage() {
  return <AdminPaymentSettingsPageClient />;
}
