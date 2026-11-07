import OAuthCallbackStatus from '@/components/auth/OAuthCallbackStatus';
import RecruiterAuthLayout from '@/components/auth/RecruiterAuthLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signing in | InterVue AI',
  robots: { index: false },
};

type RecruiterOAuthCallbackPageProps = {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
};

export default async function RecruiterOAuthCallbackPage({ params, searchParams }: RecruiterOAuthCallbackPageProps) {
  const { provider } = await params;
  const { code, state, error } = await searchParams;

  return (
    <RecruiterAuthLayout title="Signing in" subtitle="Hire IT talent with AI-assisted screening">
      <OAuthCallbackStatus portal="recruiter" provider={provider} code={code} state={state} error={error} />
    </RecruiterAuthLayout>
  );
}
