import IdentityVerificationView from '@/components/candidate/identity/IdentityVerificationView';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Identity verification | InterVue',
  description: 'Verify your identity to apply for jobs on InterVue.',
};

export default function CandidateIdentityVerificationPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <IdentityVerificationView />
      </main>
      <Footer />
    </div>
  );
}
