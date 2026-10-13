import { Metadata } from 'next';
import AccountTwoFactorView from '@/components/account/AccountTwoFactorView';

export const metadata: Metadata = {
  title: 'Xác thực 2 bước (2FA) | InterVue',
  description: 'Thiết lập xác thực 2 bước (2FA) bằng Google Authenticator và mã dự phòng.',
};

export default function TwoFactorPage() {
  return <AccountTwoFactorView />;
}
