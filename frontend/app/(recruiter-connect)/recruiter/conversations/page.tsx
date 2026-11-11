import ConnectView from '@/components/recruiter/connect/ConnectView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InterVue Connect | Direct Candidate Chat',
  description: 'Chat directly with candidates who applied to your company job postings on InterVue.',
};

export default function RecruiterConversationsPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <ConnectView />
    </main>
  );
}
