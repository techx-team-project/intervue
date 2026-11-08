'use client';

import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { toRecruiterSession } from '@/lib/auth-portal';
import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError } from '@/utils/error';
import { sanitizeRedirect } from '@/utils/redirect';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormErrorAlert from './FormErrorAlert';
import TwoFactorChallengeModal from './TwoFactorChallengeModal';

export default function RecruiterLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const res = await recruiterAuthApi.login(values);
      if (res.requiresTwoFactor && res.tempToken) {
        setChallengeToken(res.tempToken);
        return;
      }
      const session = toRecruiterSession(res);
      useAuthStore.getState().setSession(session, 'recruiter');
      toast.success('Đã đăng nhập vào cổng nhà tuyển dụng.');
      router.replace(sanitizeRedirect(searchParams?.get(REDIRECT_PARAM), ROUTES.RECRUITER_DASHBOARD));
    } catch (error: unknown) {
      applyFormError(error, setError, ['email', 'password']);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="w-full">
      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Work email"
          type="email"
          placeholder="hr@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          id="recruiter-login-password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="text-on-surface-variant flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="text-primary focus:ring-primary border-outline-variant h-4 w-4 rounded"
            />
            <span>Remember me</span>
          </label>
          <Link
            href={ROUTES.RECRUITER_FORGOT_PASSWORD}
            className="text-primary hover:text-primary-hover text-xs font-bold transition hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-primary hover:bg-primary-hover shadow-primary/20 shadow-elevation-1 mt-3 w-full rounded-xl py-3.5 text-sm font-bold text-white transition"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Sign in to the employer portal
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="border-outline-variant text-on-surface-variant mt-5 border-t pt-4 text-center text-sm">
        <span>New to InterVue for Employers? </span>
        <Link
          href={ROUTES.RECRUITER_REGISTER}
          className="text-primary hover:text-primary-hover font-bold hover:underline"
        >
          Create an account
        </Link>
      </div>

      {/* Switch to Candidate Login */}
      <div className="border-outline-variant bg-surface-container-low text-on-surface-variant mt-3 rounded-xl border p-3 text-center text-xs">
        <span>Looking for a job? </span>
        <Link href={ROUTES.LOGIN} className="text-navy hover:text-primary font-bold hover:underline">
          Candidate sign in
        </Link>
      </div>

      {challengeToken && (
        <TwoFactorChallengeModal
          isOpen={true}
          tempToken={challengeToken}
          portal="recruiter"
          onSuccess={(session) => {
            useAuthStore.getState().setSession(session, 'recruiter');
            toast.success('Đã đăng nhập vào cổng nhà tuyển dụng.');
            router.replace(sanitizeRedirect(searchParams?.get(REDIRECT_PARAM), ROUTES.RECRUITER_DASHBOARD));
          }}
          onCancel={() => setChallengeToken(null)}
        />
      )}
    </div>
  );
}
