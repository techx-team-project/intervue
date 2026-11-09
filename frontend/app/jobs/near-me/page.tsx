import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import NearbyJobsView from '@/components/jobs/near-me/NearbyJobsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobs near me | InterVue',
  description: 'Find IT jobs near your location on the map.',
};

export default function NearbyJobsPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <NearbyJobsView />
      </main>
      <Footer />
    </div>
  );
}
