'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/useLogin';
import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormErrorAlert from './FormErrorAlert';
import SocialAuthButtons from './SocialAuthButtons';
import TwoFactorChallengeModal from './TwoFactorChallengeModal';

export default function LoginForm() {
  const login = useLogin();
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

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: (res) => {
        if (res.requiresTwoFactor && res.tempToken) {
          setChallengeToken(res.tempToken);
        }
      },
      onError: (error) => applyFormError(error, setError, ['email', 'password']),
    }),
  );

  return (
    <div className="w-full">
      <SocialAuthButtons mode="login" />

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="border-outline-variant w-full border-t border-dashed" />
        </div>
        <span className="text-outline relative bg-white px-3 text-xs italic">Or sign in with email</span>
      </div>

      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-on-surface text-sm font-semibold">
              Password
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary text-xs font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="login-password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          isLoading={login.isPending}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Sign in
        </Button>
      </form>

      <div className="text-on-surface mt-4 text-center text-sm">
        <span>Don&apos;t have an account? </span>
        <Link href={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
          Sign up now
        </Link>
      </div>

      {challengeToken && (
        <TwoFactorChallengeModal
          isOpen={true}
          tempToken={challengeToken}
          portal="candidate"
          onSuccess={(session) => {
            useAuthStore.getState().setSession(session, 'candidate');
            toast.success('Signed in successfully!');
            setChallengeToken(null);
          }}
          onCancel={() => setChallengeToken(null)}
        />
      )}
    </div>
  );
}
