import { Metadata } from 'next';
import AuthPageView from '@/components/auth/AuthPageView';

export const metadata: Metadata = {
  title: 'Đăng nhập | InterVue AI - Nền tảng tuyển dụng & luyện phỏng vấn AI',
  description: 'Đăng nhập vào InterVue để luyện phỏng vấn kỹ thuật theo phương pháp STAR và tối ưu hóa CV chuẩn ATS.',
};

export default function LoginPage() {
  return <AuthPageView initialMode="login" />;
}
