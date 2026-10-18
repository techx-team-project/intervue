'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROUTES } from '@/constants/routes';
import { useRegister } from '@/hooks/useRegister';
import { RegisterFormData, registerSchema } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import SocialAuthButtons from './SocialAuthButtons';

const FORM_FIELDS = ['name', 'email', 'password', 'confirmPassword', 'acceptTerms'] as const;

export default function RegisterForm() {
  const registerAccount = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  });

  const onSubmit = handleSubmit((values) =>
    registerAccount.mutate(values, { onError: (error) => applyFormError(error, setError, FORM_FIELDS) }),
  );

  return (
    <div className="w-full">
      <SocialAuthButtons mode="register" />

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400 italic">Or sign up with email</span>
      </div>

      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-3.5">
        <Input
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="At least 8 characters with upper, lower, digit and special"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              {...register('acceptTerms')}
            />
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold text-emerald-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-emerald-600 hover:underline">
                Privacy Policy
              </a>{' '}
              of InterVue.
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1 text-xs font-medium text-rose-500">{errors.acceptTerms.message}</p>}
        </div>

        <Button
          type="submit"
          isLoading={registerAccount.isPending}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Create account
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-700">
        <span>Already have an account? </span>
        <Link href={ROUTES.LOGIN} className="font-bold text-emerald-600 hover:underline">
          Sign in now
        </Link>
      </div>
    </div>
  );
}
