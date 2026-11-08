import CandidateProfileView from '@/components/candidate-profile/CandidateProfileView';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My profile | InterVue',
};

export default function ProfilePage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <CandidateProfileView />
      </main>

      <Footer />
    </div>
  );
}
