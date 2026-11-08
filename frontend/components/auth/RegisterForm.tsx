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
import { useForm, useWatch } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import SocialAuthButtons from './SocialAuthButtons';

const FORM_FIELDS = ['name', 'email', 'password', 'confirmPassword', 'acceptTerms'] as const;

export default function RegisterForm() {
  const registerAccount = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  });

  const acceptTerms = useWatch({ control, name: 'acceptTerms' });

  const onSubmit = handleSubmit((values) =>
    registerAccount.mutate(values, { onError: (error) => applyFormError(error, setError, FORM_FIELDS) }),
  );

  return (
    <div className="w-full">
      <SocialAuthButtons mode="register" acceptTerms={acceptTerms} />

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="border-outline-variant w-full border-t border-dashed" />
        </div>
        <span className="text-outline relative bg-white px-3 text-xs italic">Or sign up with email</span>
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
          <label className="text-on-surface-variant flex cursor-pointer items-start gap-2.5 text-xs select-none">
            <input
              type="checkbox"
              className="border-outline text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded"
              {...register('acceptTerms')}
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </a>{' '}
              of InterVue.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-error mt-1 text-xs font-medium">{errors.acceptTerms.message}</p>}
        </div>

        <Button
          type="submit"
          isLoading={registerAccount.isPending}
          disabled={!acceptTerms}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Create account
        </Button>
      </form>

      <div className="text-on-surface mt-4 text-center text-sm">
        <span>Already have an account? </span>
        <Link href={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
          Sign in now
        </Link>
      </div>
    </div>
  );
}
