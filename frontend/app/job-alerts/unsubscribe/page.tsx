import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import JobAlertUnsubscribeView from '@/components/job-alert/JobAlertUnsubscribeView';

export const metadata: Metadata = {
  title: 'Unsubscribe from Job Alert | InterVue',
  description: 'Manage or pause your email notifications for Job Alerts on InterVue.',
};

export default function UnsubscribePage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          }
        >
          <JobAlertUnsubscribeView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
