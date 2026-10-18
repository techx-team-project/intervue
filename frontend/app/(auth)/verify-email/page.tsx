import AuthLayout from '@/components/auth/AuthLayout';
import VerifyEmailStatus from '@/components/auth/VerifyEmailStatus';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify email | InterVue AI',
  description: 'Verify the email address of your InterVue account.',
  robots: { index: false },
};

type VerifyEmailPageProps = { searchParams: Promise<{ token?: string }> };

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <AuthLayout title="Verify email">
      <VerifyEmailStatus token={token} />
    </AuthLayout>
  );
}
