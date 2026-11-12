import { PhoneVerificationView } from '@/components/recruiter/company/verification/PhoneVerificationView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recruiter Phone Verification | InterVue',
  description: 'Verify your phone number to strengthen account security and build hiring credibility on InterVue.',
};

export default function PhoneVerificationPage() {
  return <PhoneVerificationView />;
}
