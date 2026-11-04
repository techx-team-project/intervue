import ConfirmEmailChangeStatus from '@/components/auth/ConfirmEmailChangeStatus';
import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm new employer email | InterVue AI',
  description: 'Confirm the new email address of your InterVue employer account.',
  robots: { index: false },
};

type RecruiterConfirmEmailChangePageProps = { searchParams: Promise<{ token?: string }> };

export default async function RecruiterConfirmEmailChangePage({ searchParams }: RecruiterConfirmEmailChangePageProps) {
  const { token } = await searchParams;

  return (
    <RecruiterAuthLayout title="Confirm your new email" subtitle="Update your employer account email">
      <ConfirmEmailChangeStatus token={token} portal="recruiter" />
    </RecruiterAuthLayout>
  );
}
