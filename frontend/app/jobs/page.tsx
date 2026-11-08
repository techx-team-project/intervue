import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import PublicJobsListView from '@/components/jobs/PublicJobsListView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Latest IT Jobs | InterVue',
  description: 'Find IT jobs by role, location, salary and skills on InterVue.',
};

export default function JobsPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense>
          <PublicJobsListView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
