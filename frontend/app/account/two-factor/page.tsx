import { Metadata } from 'next';
import AccountTwoFactorView from '@/components/account/AccountTwoFactorView';

export const metadata: Metadata = {
  title: 'Two-factor authentication | InterVue',
  description: 'Set up two-factor authentication with Google Authenticator and backup codes.',
};

export default function TwoFactorPage() {
  return <AccountTwoFactorView />;
}
