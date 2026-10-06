import { Metadata } from 'next';
import AuthPageView from '@/components/auth/AuthPageView';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | InterVue AI - Nền tảng tuyển dụng & luyện phỏng vấn AI',
  description:
    'Đăng ký tài khoản InterVue ngay hôm nay để trải nghiệm luyện phỏng vấn AI không giới hạn và nhận đánh giá CV chuẩn ATS.',
};

export default function RegisterPage() {
  return <AuthPageView initialMode="register" />;
}
