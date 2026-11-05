import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import VerifyEmailStatus from '@/components/auth/VerifyEmailStatus';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify employer email | InterVue AI',
  description: 'Verify the email address of your InterVue employer account.',
  robots: { index: false },
};

type RecruiterVerifyEmailPageProps = { searchParams: Promise<{ token?: string }> };

export default async function RecruiterVerifyEmailPage({ searchParams }: RecruiterVerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <RecruiterAuthLayout title="Verify your email" subtitle="Activate your employer account">
      <VerifyEmailStatus token={token} portal="recruiter" />
    </RecruiterAuthLayout>
  );
}
