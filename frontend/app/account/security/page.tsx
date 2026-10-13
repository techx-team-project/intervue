import { Metadata } from 'next';
import AccountSecurityView from '@/components/account/AccountSecurityView';

export const metadata: Metadata = {
  title: 'Bảo mật tài khoản | InterVue',
  description: 'Quản lý an ninh tài khoản, phiên đăng nhập đang hoạt động và thiết bị truy cập.',
};

export default function SecurityPage() {
  return <AccountSecurityView />;
}
