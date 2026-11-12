import PageHeader from '@/components/recruiter/PageHeader';
import MyServicesView from '@/components/recruiter/services/my/MyServicesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Services | InterVue Recruiter',
  description: 'Services your company has purchased, what is left and which jobs they are running on',
};

export default function MyServicesPage() {
  return (
    <>
      <PageHeader title="My Services" description="Purchased services of your company and their usage" />
      <MyServicesView />
    </>
  );
}
