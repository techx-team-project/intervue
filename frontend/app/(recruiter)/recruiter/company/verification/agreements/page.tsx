import { PersonalDataProtectionView } from '@/components/recruiter/company/verification/PersonalDataProtectionView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Data Processing Agreements | InterVue',
  description:
    'Personal data processing agreements between Candidates, Recruiters and the InterVue platform under Decree 13/2023/ND-CP.',
};

export default function PersonalDataProtectionPage() {
  return <PersonalDataProtectionView />;
}
