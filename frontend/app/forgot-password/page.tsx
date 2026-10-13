import { Metadata } from 'next';
import AuthPageView from '@/components/auth/AuthPageView';

export const metadata: Metadata = {
  title: 'Khôi phục mật khẩu | InterVue AI',
  description: 'Khôi phục mật khẩu tài khoản InterVue dễ dàng và bảo mật với mã hóa xác thực 2 bước.',
};

export default function ForgotPasswordPage() {
  return <AuthPageView initialMode="forgot-password" />;
}
