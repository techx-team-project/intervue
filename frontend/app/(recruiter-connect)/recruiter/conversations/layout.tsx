import ConnectView from '@/components/recruiter/connect/ConnectView';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'InterVue Connect | Direct Candidate Messaging',
  description: 'Manage direct chat conversations with job applicants on InterVue.',
};

export default function RecruiterConversationsLayout({ children }: { children: ReactNode }) {
  return <ConnectView>{children}</ConnectView>;
}
