import AccountTwoFactorView from '@/components/account/AccountTwoFactorView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Two-factor authentication | InterVue Recruiter',
  description: 'Manage two-factor security for your recruiter account.',
};

export default function RecruiterTwoFactorPage() {
  return <AccountTwoFactorView portal="recruiter" />;
}
