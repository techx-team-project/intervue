import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import JobAlertsView from '@/components/candidate/job-alerts/JobAlertsView';

export const metadata: Metadata = {
  title: 'Job Alerts | Candidate Portal - InterVue',
  description: 'Manage your automated IT job alerts and daily/weekly email digests on InterVue.',
};

export default function CandidateJobAlertsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />
      <main className="flex-1">
        <JobAlertsView />
      </main>
      <Footer />
    </div>
  );
}
