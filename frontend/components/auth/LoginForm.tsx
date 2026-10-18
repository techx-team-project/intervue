'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/useLogin';
import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import SocialAuthButtons from './SocialAuthButtons';

export default function LoginForm() {
  const login = useLogin();
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
    login.mutate(values, { onError: (error) => applyFormError(error, setError, ['email', 'password']) }),
  );

  return (
    <div className="w-full">
      <SocialAuthButtons mode="login" />

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400 italic">Or sign in with email</span>
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
            <label htmlFor="login-password" className="text-sm font-semibold text-slate-800">
              Password
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-xs font-semibold text-emerald-600 hover:underline">
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

      <div className="mt-4 text-center text-sm text-slate-700">
        <span>Don&apos;t have an account? </span>
        <Link href={ROUTES.REGISTER} className="font-bold text-emerald-600 hover:underline">
          Sign up now
        </Link>
      </div>
    </div>
  );
}
