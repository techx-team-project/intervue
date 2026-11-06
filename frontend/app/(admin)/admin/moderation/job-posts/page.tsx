import AdminJobsPageClient from '@/components/admin/jobs/AdminJobsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobs | InterVue Admin',
  description: 'Review job postings, hide those that break the rules and restore them once resolved.',
};

export default function AdminJobsPage() {
  return <AdminJobsPageClient />;
}
