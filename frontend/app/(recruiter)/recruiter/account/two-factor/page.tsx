import AccountTwoFactorView from '@/components/account/AccountTwoFactorView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực 2 bước | InterVue Recruiter',
  description: 'Quản lý bảo mật 2 lớp cho tài khoản nhà tuyển dụng.',
};

export default function RecruiterTwoFactorPage() {
  return <AccountTwoFactorView portal="recruiter" />;
}
