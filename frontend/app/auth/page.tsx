import { Metadata } from 'next';
import AuthPageView from '@/components/auth/AuthPageView';

export const metadata: Metadata = {
  title: 'Tài khoản & Xác thực | InterVue AI',
  description: 'Cổng đăng nhập và đăng ký tài khoản InterVue AI.',
};

export default function AuthPage() {
  return <AuthPageView initialMode="login" />;
}
