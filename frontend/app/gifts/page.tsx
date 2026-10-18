import { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import GiftActivationView from '@/components/gift/GiftActivationView';

export const metadata: Metadata = {
  title: 'Gift Vouchers & VIP Rewards | InterVue - TopCV.vn',
  description:
    'Activate your gift voucher code on InterVue to unlock VIP Education, Pro, and Premium packages along with ecosystem partner perks.',
};

export default function GiftsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f2f6] antialiased">
      <Header />

      <main className="flex-1">
        <GiftActivationView />
      </main>

      <Footer />
    </div>
  );
}
