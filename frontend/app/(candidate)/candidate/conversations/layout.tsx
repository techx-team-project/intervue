import CandidateConnectView from '@/components/candidate/connect/CandidateConnectView';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'InterVue Connect | Direct Recruiter Messaging',
  description: 'Connect and chat directly with recruiters on InterVue.',
};

export default function CandidateConversationsLayout({ children }: { children: ReactNode }) {
  return <CandidateConnectView>{children}</CandidateConnectView>;
}
