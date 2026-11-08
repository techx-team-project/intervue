import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MascotPlaygroundView from '@/components/mascot/MascotPlaygroundView';

export const metadata: Metadata = {
  title: 'InterVue AI Bot Playground - InterVue',
  description: 'Play with the InterVue AI Bot: explore 9 lively expressions with smooth 60-120 FPS interaction.',
};

export default function MascotPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Header />

      <main className="flex-1">
        <MascotPlaygroundView />
      </main>

      <Footer />
    </div>
  );
}
