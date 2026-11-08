import SavedItemsView from '@/components/candidate/saved/SavedItemsView';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved jobs | InterVue',
  description: 'Jobs you saved and companies you follow.',
};

export default async function CandidateSavedPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;

  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SavedItemsView initialTab={tab === 'companies' ? 'companies' : 'jobs'} />
      </main>
      <Footer />
    </div>
  );
}
