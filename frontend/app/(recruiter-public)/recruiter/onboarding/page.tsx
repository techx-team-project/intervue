import RecruiterOnboardingView from '@/components/auth/RecruiterOnboardingView';
import RequireAuth from '@/components/auth/RequireAuth';
import { ROLES } from '@/constants/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete your employer profile | InterVue AI',
  description: 'Tell InterVue about your company and hiring needs so we can support your IT hiring.',
};

export default function RecruiterOnboardingPage() {
  return (
    <RequireAuth roles={[ROLES.RECRUITER]}>
      <RecruiterOnboardingView />
    </RequireAuth>
  );
}
