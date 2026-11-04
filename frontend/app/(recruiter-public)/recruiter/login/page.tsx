import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import RecruiterGuestRedirect from '@/components/auth/RecruiterGuestRedirect';
import RecruiterLoginForm from '@/components/auth/RecruiterLoginForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Employer sign in | InterVue AI',
  description: 'Sign in to the InterVue employer portal to manage job posts and screen candidates with AI assistance.',
};

export default function RecruiterLoginPage() {
  return (
    <RecruiterAuthLayout title="Sign in to the employer portal" subtitle="Hire IT talent with AI-assisted screening">
      <RecruiterGuestRedirect />
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-slate-100" />}>
        <RecruiterLoginForm />
      </Suspense>
    </RecruiterAuthLayout>
  );
}
