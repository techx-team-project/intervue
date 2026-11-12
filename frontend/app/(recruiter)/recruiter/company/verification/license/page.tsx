import { BusinessLicenseView } from '@/components/recruiter/company/verification/BusinessLicenseView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Business License | InterVue',
  description:
    'Upload your Enterprise Registration Certificate or Letter of Authorization to verify your legal entity on InterVue.',
};

export default function BusinessLicensePage() {
  return <BusinessLicenseView />;
}
