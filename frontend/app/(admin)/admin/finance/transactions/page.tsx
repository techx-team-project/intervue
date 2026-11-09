import AdminPaymentTransactionsPageClient from '@/components/admin/finance/AdminPaymentTransactionsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Transactions | InterVue Admin',
  description: 'Incoming bank transfers pulled from SePay and their matching status.',
};

export default function AdminPaymentTransactionsPage() {
  return <AdminPaymentTransactionsPageClient />;
}
