import { Metadata } from 'next';
import AccountOverviewView from '@/components/account/AccountOverviewView';

export const metadata: Metadata = {
  title: 'Cài đặt tìm việc & Tổng quan tài khoản | InterVue',
  description: 'Quản lý trạng thái tìm việc, cho phép nhà tuyển dụng tìm kiếm hồ sơ và theo dõi độ quan tâm CV.',
};

export default function AccountPage() {
  return <AccountOverviewView />;
}
