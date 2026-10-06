import { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import GiftActivationView from '@/components/gift/GiftActivationView';

export const metadata: Metadata = {
  title: 'Nhận quà tặng & Kích hoạt mã ưu đãi VIP | TopCV.vn - InterVue',
  description:
    'Kích hoạt mã code quà tặng TopCV & InterVue để nhận đặc quyền: Nâng cấp tài khoản Education VIP, Pro VIP, Premium VIP và nhận quà tặng khoá học thực chiến từ đối tác Gitiho.',
};

export default function QuaTangPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f2f6] antialiased">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Standalone Gift Activation View (No Account Sidebar) */}
      <main className="flex-1">
        <GiftActivationView />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}
