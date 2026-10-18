import { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import UpgradeLandingView from '@/components/account/UpgradeLandingView';

export const metadata: Metadata = {
  title: 'Nâng cấp tài khoản VIP | InterVue - CV xịn việc làm chất',
  description:
    'Nâng cấp tài khoản VIP trên InterVue để mở khóa nhiều quyền lợi hơn: Tạo không giới hạn CV, thời gian tải siêu tốc, ưu tiên đẩy Top hồ sơ với NTD.',
};

export default function UpgradePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white antialiased">
      <Header />

      <main className="flex-1 bg-white">
        <UpgradeLandingView />
      </main>

      <Footer />
    </div>
  );
}
