import { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import UpgradeLandingView from '@/components/account/UpgradeLandingView';

export const metadata: Metadata = {
  title: 'Upgrade to VIP | InterVue',
  description:
    'Upgrade to VIP on InterVue to unlock more benefits: unlimited CVs, faster downloads and priority profile boosts with recruiters.',
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
