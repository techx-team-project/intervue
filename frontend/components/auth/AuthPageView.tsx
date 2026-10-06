'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout, { AuthMode } from './AuthLayout';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthPageViewProps {
  initialMode?: AuthMode;
}

function AuthContent({ initialMode = 'login' }: AuthPageViewProps) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'login' || queryMode === 'register' || queryMode === 'forgot-password') {
      setTimeout(() => {
        setMode(queryMode);
      }, 0);
    }
  }, [searchParams]);

  const handleSwitchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    if (typeof window !== 'undefined') {
      const targetUrl = nextMode === 'forgot-password' ? '/forgot-password' : `/${nextMode}`;
      window.history.replaceState(null, '', targetUrl);
    }
  };

  return (
    <AuthLayout mode={mode} onModeChange={handleSwitchMode}>
      <div className="animate-in fade-in zoom-in-[0.98] duration-200">
        {mode === 'login' && <LoginForm onSwitchMode={handleSwitchMode} />}
        {mode === 'register' && <RegisterForm onSwitchMode={handleSwitchMode} />}
        {mode === 'forgot-password' && <ForgotPasswordForm onSwitchMode={handleSwitchMode} />}
      </div>
    </AuthLayout>
  );
}

export default function AuthPageView({ initialMode = 'login' }: AuthPageViewProps) {
  return (
    <Suspense
      fallback={
        <AuthLayout mode={initialMode} onModeChange={() => {}}>
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00b14f] border-t-transparent" />
          </div>
        </AuthLayout>
      }
    >
      <AuthContent initialMode={initialMode} />
    </Suspense>
  );
}
