import { Metadata } from 'next';
import AccountPasswordView from '@/components/account/AccountPasswordView';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu | InterVue',
  description: 'Đổi mật khẩu đăng nhập tài khoản an toàn với tiêu chuẩn mã hóa cao.',
};

export default function PasswordPage() {
  return <AccountPasswordView />;
}
