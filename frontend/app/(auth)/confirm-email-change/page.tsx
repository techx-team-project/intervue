import AuthLayout from '@/components/auth/AuthLayout';
import ConfirmEmailChangeStatus from '@/components/auth/ConfirmEmailChangeStatus';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm new email | InterVue AI',
  description: 'Confirm the new email address of your InterVue account.',
  robots: { index: false },
};

type ConfirmEmailChangePageProps = { searchParams: Promise<{ token?: string }> };

export default async function ConfirmEmailChangePage({ searchParams }: ConfirmEmailChangePageProps) {
  const { token } = await searchParams;

  return (
    <AuthLayout title="Confirm new email">
      <ConfirmEmailChangeStatus token={token} />
    </AuthLayout>
  );
}
