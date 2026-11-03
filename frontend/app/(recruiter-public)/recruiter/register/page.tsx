import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import RecruiterRegisterView from '@/components/auth/RecruiterRegisterView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản Nhà tuyển dụng | InterVue AI',
  description:
    'Đăng ký tài khoản nhà tuyển dụng miễn phí trên InterVue. Cùng tạo dựng lợi thế cho doanh nghiệp bằng công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel.',
};

export default function RecruiterRegisterPage() {
  return (
    <>
      <RecruiterGuestRedirect />
      <RecruiterRegisterView />
    </>
  );
}
