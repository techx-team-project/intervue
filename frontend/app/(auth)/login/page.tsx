import AuthLayout from '@/components/auth/AuthLayout';
import GuestRedirect from '@/components/auth/GuestRedirect';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in | InterVue AI - AI-powered recruitment & interview practice',
  description:
    'Sign in to InterVue to practice technical interviews with the STAR method and optimize your ATS-ready CV.',
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back">
      <GuestRedirect />
      <LoginForm />
    </AuthLayout>
  );
}
