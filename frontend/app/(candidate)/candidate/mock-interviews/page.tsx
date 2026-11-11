import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MockInterviewClientView from '@/components/candidate/mock-interviews/MockInterviewClientView';

export const metadata: Metadata = {
  title: 'AI Mock Interview | InterVue Candidate',
  description: 'Luyện tập phỏng vấn thử cùng AI dựa trên CV thật và nhận đánh giá 3 điểm mạnh, 3 điểm cần cải thiện.',
};

export default function CandidateMockInterviewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />
      <main className="flex-1">
        <MockInterviewClientView />
      </main>
      <Footer />
    </div>
  );
}
