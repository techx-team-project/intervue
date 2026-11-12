import { CompanyProfileView } from '@/components/recruiter/company/CompanyProfileView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Company Information | InterVue',
  description:
    'Manage legal entity details, company profile and employee benefits on the InterVue recruitment platform.',
};

export default function CompanyProfilePage() {
  return <CompanyProfileView />;
}
