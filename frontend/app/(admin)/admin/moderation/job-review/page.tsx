import AdminJobReviewQueue from '@/components/admin/dashboard/AdminJobReviewQueue';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job review | InterVue Admin',
  description: 'Review the job posts recruiters submit before they go live.',
};

export default function AdminJobReviewPage() {
  return (
    <div className="space-y-4">
      <AdminPageHeader description="Approve or reject the job posts recruiters submitted for review." />
      <AdminJobReviewQueue />
    </div>
  );
}
