import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import PublicJobsListView from '@/components/jobs/PublicJobsListView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Việc làm IT mới nhất | InterVue',
  description: 'Tìm việc làm IT phù hợp theo vị trí, địa điểm, mức lương và kỹ năng trên InterVue.',
};

export default function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
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
