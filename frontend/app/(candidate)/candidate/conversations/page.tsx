import CandidateConnectView from '@/components/candidate/connect/CandidateConnectView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InterVue Connect | Direct Recruiter Chat',
  description: 'Chat directly with recruiters and companies on InterVue.',
};

export default function CandidateConversationsPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <CandidateConnectView />
    </main>
  );
}
