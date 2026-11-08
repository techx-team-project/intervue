import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvReviewClientView from '@/components/cv-review/CvReviewClientView';

export const metadata: Metadata = {
  title: 'AI Chấm điểm CV | InterVue Candidate',
  description: 'Đánh giá và tối ưu hóa CV bằng trí tuệ nhân tạo.',
};

export default function CandidateCvReviewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />
      <main className="container-topcv flex-1">
        <CvReviewClientView />
      </main>
      <Footer />
    </div>
  );
}
