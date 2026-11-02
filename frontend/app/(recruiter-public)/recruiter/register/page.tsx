import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import RecruiterRegisterForm from '@/components/auth/RecruiterRegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản Doanh nghiệp | InterVue AI',
  description: 'Đăng ký tài khoản nhà tuyển dụng miễn phí trên InterVue để tiếp cận ứng viên IT chất lượng cao.',
};

export default function RecruiterRegisterPage() {
  return (
    <RecruiterAuthLayout
      title="Đăng ký tài khoản Doanh nghiệp"
      subtitle="Bắt đầu tuyển dụng nhân sự IT nhanh chóng & tối ưu chi phí"
    >
      <RecruiterGuestRedirect />
      <RecruiterRegisterForm />
    </RecruiterAuthLayout>
  );
}

