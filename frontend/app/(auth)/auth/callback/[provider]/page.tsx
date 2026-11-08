import AuthLayout from '@/components/auth/AuthLayout';
import OAuthCallbackStatus from '@/components/auth/OAuthCallbackStatus';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signing in | InterVue AI',
  robots: { index: false },
};

type OAuthCallbackPageProps = {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
};

export default async function OAuthCallbackPage({ params, searchParams }: OAuthCallbackPageProps) {
  const { provider } = await params;
  const { code, state, error } = await searchParams;

  return (
    <AuthLayout title="Signing in">
      <OAuthCallbackStatus provider={provider} code={code} state={state} error={error} />
    </AuthLayout>
  );
}
