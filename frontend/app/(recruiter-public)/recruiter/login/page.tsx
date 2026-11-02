import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import RecruiterLoginForm from '@/components/auth/RecruiterLoginForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Đăng nhập Cổng Doanh nghiệp | InterVue AI',
  description: 'Đăng nhập Cổng Doanh nghiệp InterVue để quản lý tin tuyển dụng và tìm kiếm ứng viên với trợ lý AI.',
};

export default function RecruiterLoginPage() {
  return (
    <RecruiterAuthLayout
      title="Đăng nhập Cổng Doanh nghiệp"
      subtitle="Tiếp cận hơn 100.000+ nhân tài IT cùng trợ lý tuyển dụng AI"
    >
      <RecruiterGuestRedirect />
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-slate-100" />}>
        <RecruiterLoginForm />
      </Suspense>
    </RecruiterAuthLayout>
  );
}
