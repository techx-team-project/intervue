import PageHeader from '@/components/recruiter/PageHeader';
import ServiceCatalogView from '@/components/recruiter/services/ServiceCatalogView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Services | InterVue Recruiter',
  description: 'InterVue job posting, promotion and recruitment support packages',
};

export default function RecruiterServicesPage() {
  return (
    <>
      <PageHeader title="Buy Services" description="Choose the service package that fits your hiring needs" />
      <ServiceCatalogView />
    </>
  );
}
