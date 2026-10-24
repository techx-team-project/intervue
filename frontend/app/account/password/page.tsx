import { Metadata } from 'next';
import AccountPasswordView from '@/components/account/AccountPasswordView';

export const metadata: Metadata = {
  title: 'Change password | InterVue',
  description: 'Change your account password securely with strong encryption standards.',
};

export default function PasswordPage() {
  return <AccountPasswordView />;
}
