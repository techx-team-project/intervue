import AuthLayout from '@/components/auth/AuthLayout';
import GuestRedirect from '@/components/auth/GuestRedirect';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create account | InterVue AI - AI-powered recruitment & interview practice',
  description: 'Create your InterVue account today for unlimited AI interview practice and ATS-ready CV reviews.',
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Welcome to InterVue">
      <GuestRedirect />
      <RegisterForm />
    </AuthLayout>
  );
}
