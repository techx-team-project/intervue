import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MockInterviewClientView from '@/components/candidate/mock-interviews/MockInterviewClientView';

export const metadata: Metadata = {
  title: 'AI Mock Interview | InterVue Candidate',
  description:
    'Practice 1-on-1 AI mock interviews tailored to your resume and target role. Receive STAR feedback, 3 key strengths, and 3 areas for improvement.',
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
