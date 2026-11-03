import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import RecruiterOnboardingView from '@/components/auth/RecruiterOnboardingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete your employer profile | InterVue AI',
  description: 'Tell InterVue about your company and hiring needs so we can support your IT hiring.',
};

export default function RecruiterOnboardingPage() {
  return (
    <>
      <RecruiterGuestRedirect />
      <RecruiterOnboardingView />
    </>
  );
}
