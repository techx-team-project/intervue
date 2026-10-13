import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MascotPlaygroundView from '@/components/mascot/MascotPlaygroundView';

export const metadata: Metadata = {
  title: 'Góc Giải Trí InterVue AI Bot - InterVue',
  description:
    'Góc giải trí và chơi đùa cùng InterVue Bot AI: Khám phá 9 sắc thái biểu cảm nhộn nhịp, tương tác mượt mà 60-120 FPS cùng bạn nhỏ AI thông minh của InterVue.',
};

export default function MascotPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Header InterVue */}
      <Header />

      {/* Main Interactive Playground */}
      <main className="flex-1">
        <MascotPlaygroundView />
      </main>

      {/* Footer InterVue */}
      <Footer />
    </div>
  );
}
