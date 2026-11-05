import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset employer password | InterVue AI',
  description: 'Create a new password for your InterVue employer account.',
  robots: { index: false },
};

type RecruiterResetPasswordPageProps = { searchParams: Promise<{ token?: string }> };

export default async function RecruiterResetPasswordPage({ searchParams }: RecruiterResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <RecruiterAuthLayout title="Reset password" subtitle="Create a new password for your employer account">
      <ResetPasswordForm token={token} portal="recruiter" />
    </RecruiterAuthLayout>
  );
}
