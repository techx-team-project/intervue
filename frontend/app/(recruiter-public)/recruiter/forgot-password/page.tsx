import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employer forgot password | InterVue AI',
  description: 'Recover the password of your InterVue employer account quickly and securely.',
};

export default function RecruiterForgotPasswordPage() {
  return (
    <RecruiterAuthLayout title="Forgot password" subtitle="Recover access to your employer account">
      <RecruiterGuestRedirect />
      <ForgotPasswordForm portal="recruiter" />
    </RecruiterAuthLayout>
  );
}
