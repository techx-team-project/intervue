import { Metadata } from 'next';
import AccountSecurityView from '@/components/account/AccountSecurityView';

export const metadata: Metadata = {
  title: 'Account security | InterVue',
  description: 'Manage account security, active sessions and the devices that access it.',
};

export default function SecurityPage() {
  return <AccountSecurityView />;
}
