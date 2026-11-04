import HiringNeedsView from '@/components/recruiter/hiring-needs/HiringNeedsView';
import { MOCK_RECRUITER_HIRING_NEEDS } from '@/mocks/recruiter-hiring-needs.mock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hiring needs | InterVue',
  description: 'Plan the IT roles your company needs to fill and the hiring budget for each role on InterVue.',
};

export default function RecruiterHiringNeedsPage() {
  return <HiringNeedsView initialNeeds={MOCK_RECRUITER_HIRING_NEEDS} />;
}
