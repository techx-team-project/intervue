import CandidateCvManager from '@/components/candidate/cvs/CandidateCvManager';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV của tôi | InterVue',
  description: 'Tải lên và quản lý các CV dùng để ứng tuyển.',
};

export default function CandidateCvsPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CandidateCvManager />
      </main>
      <Footer />
    </div>
  );
}
