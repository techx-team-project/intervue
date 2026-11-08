import CandidateInterviewList from '@/components/candidate/interviews/CandidateInterviewList';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interviews | InterVue',
  description: 'Confirm, reschedule and track your interviews.',
};

export default function CandidateInterviewsPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CandidateInterviewList />
      </main>
      <Footer />
    </div>
  );
}
