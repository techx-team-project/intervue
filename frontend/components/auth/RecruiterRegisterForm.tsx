'use client';

import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROUTES } from '@/constants/routes';
import { recruiterRegisterSchema, type RecruiterRegisterFormData } from '@/schemas/recruiter.schema';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Lock, Mail, PhoneCall, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import RecruiterGuestRedirect from './RecruiterGuestRedirect';
import RecruiterOnboarding from './RecruiterOnboarding';
import RecruiterProfileFields from './RecruiterProfileFields';
import RecruiterVerifyEmailNotice from './RecruiterVerifyEmailNotice';

function getPasswordStrength(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  if (score <= 2) {
    return {
      label: 'Weak',
      color: 'text-rose-600',
      bar: 'bg-rose-500',
      width: '25%',
    };
  }
  if (score === 3) {
    return {
      label: 'Fair',
      color: 'text-orange-600',
      bar: 'bg-orange-500',
      width: '50%',
    };
  }
  if (score === 4) {
    return {
      label: 'Good',
      color: 'text-amber-600',
      bar: 'bg-amber-500',
      width: '75%',
    };
  }
  return {
    label: 'Strong',
    color: 'text-primary',
    bar: 'bg-primary',
    width: '100%',
  };
}

export default function RecruiterRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [registered, setRegistered] = useState<{ email: string; name: string } | null>(null);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RecruiterRegisterFormData>({
    resolver: zodResolver(recruiterRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      gender: 'MALE',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      city: '',
      districtWard: '',
      acceptTerms: false,
      acceptMarketing: true,
    },
  });

  const password = useWatch({ control, name: 'password' }) || '';
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const session = await recruiterAuthApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: values.acceptTerms,
      });
      useAuthStore.getState().setSession(session);

      setRegistered({ email: values.email, name: values.name });
    } catch (error: unknown) {
      applyFormError(error, setError, [
        'name',
        'email',
        'password',
        'confirmPassword',
        'acceptTerms',
        'companyName',
        'phone',
        'city',
      ]);
    } finally {
      setIsLoading(false);
    }
  });

  if (registered && isOnboardingDone) return <RecruiterVerifyEmailNotice email={registered.email} />;
  if (registered) {
    return <RecruiterOnboarding startStep="needs" name={registered.name} onFinish={() => setIsOnboardingDone(true)} />;
  }

  return (
    <div className="w-full">
      <RecruiterGuestRedirect />
      <div className="mb-6 sm:mb-8">
        <Link href={ROUTES.RECRUITER_LANDING} aria-label="Back to InterVue for Employers" className="inline-block">
          <Image
            src="/intervue-logo.png"
            alt="InterVue"
            width={160}
            height={46}
            priority
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl xl:text-[32px]">
          Create your employer account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Post IT jobs, receive applications and screen candidates faster with InterVue&apos;s AI assistance.
        </p>
      </div>

      <div className="mb-7 rounded-xl border border-emerald-300/90 bg-[#f0fdf4] p-5 text-sm shadow-xs transition-all sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 sm:text-base">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#00b14f]" />
            <span>Account rules</span>
          </div>
          <button
            type="button"
            aria-label="Show or hide account rules"
            aria-expanded={isNoticeOpen}
            aria-controls="recruiter-rules-box"
            onClick={() => setIsNoticeOpen((prev) => !prev)}
            className="cursor-pointer rounded-md p-1.5 text-slate-500 transition hover:bg-emerald-100 hover:text-slate-800"
          >
            {isNoticeOpen ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
          </button>
        </div>

        {isNoticeOpen && (
          <div
            id="recruiter-rules-box"
            className="mt-3.5 space-y-2.5 border-t border-emerald-200/80 pt-3.5 text-slate-700"
          >
            <p className="text-sm leading-relaxed font-semibold text-rose-600 sm:text-[14.5px]">
              • To keep the service fair, InterVue does not allow one person to create multiple accounts.
            </p>
            <p className="text-sm leading-relaxed sm:text-[14px]">
              If a violation is found, InterVue may suspend all duplicate accounts or block access entirely.
            </p>
            <p className="text-sm leading-relaxed sm:text-[14px]">
              Each account can publish the standard number of job posts once its information has been verified.
            </p>
            <div className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-800 sm:text-base">
              <PhoneCall className="h-4 w-4 shrink-0 text-[#00b14f]" />
              <span>Support hotline: </span>
              <a href="tel:0812665001" className="text-base font-bold text-[#00b14f] hover:underline sm:text-lg">
                0812.665.001
              </a>
            </div>
          </div>
        )}
      </div>

      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Account</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[14.5px]">
            To provide our services, we need to process some personal data as described in our Privacy Policy and Terms
            of Service. Please choose what you agree to:
          </p>

          <div className="mt-4 space-y-3.5">
            <div>
              <label
                htmlFor="acceptTerms"
                className="flex cursor-pointer items-start gap-3 text-sm text-slate-700 select-none sm:text-[14.5px]"
              >
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="mt-0.5 h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  {...register('acceptTerms')}
                />
                <span>
                  I have read and agree to InterVue&apos;s{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#00b14f] hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#00b14f] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <p className="mt-1.5 ml-7 text-xs font-medium text-rose-600 sm:text-[13px]">
                * We cannot provide our services without this consent.
              </p>
              {errors.acceptTerms && (
                <p className="mt-1 ml-7 text-xs font-medium text-rose-500 sm:text-[13px]">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="acceptMarketing"
                className="flex cursor-pointer items-start gap-3 text-sm text-slate-700 select-none sm:text-[14.5px]"
              >
                <input
                  id="acceptMarketing"
                  type="checkbox"
                  className="mt-0.5 h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  {...register('acceptMarketing')}
                />
                <span>
                  I agree to receive updates from InterVue: tips for writing effective job posts, important notices
                  about my job posts and applications, and hiring solutions that fit my company.
                </span>
              </label>
              <p className="mt-1.5 ml-7 text-xs font-medium text-[#00b14f] sm:text-[13px]">
                * Recommended: without this consent, our team cannot contact you to help verify your account and publish
                your job posts quickly.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={ROUTES.RECRUITER_ONBOARDING}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#4285F4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3367d6] hover:shadow active:scale-[0.99] sm:text-base"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </span>
              <span>Sign up with Google</span>
            </Link>
          </div>

          <div className="relative my-7 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase sm:text-sm">
              Or with email
            </span>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Input
                id="email"
                label="Work email *"
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="py-3 text-sm sm:text-base"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <p className="mt-1.5 text-xs leading-relaxed text-rose-600 sm:text-[13px]">
                * If you sign up with an email outside your company domain, some services may be limited.
              </p>
            </div>

            <div>
              <PasswordInput
                id="password"
                label="Password *"
                placeholder="Password"
                autoComplete="new-password"
                className="py-3 text-sm sm:text-base"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
              />
              {password && (
                <div className="mt-2 space-y-1.5" aria-live="polite">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Password strength:</span>
                    <span className={`font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.bar}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <PasswordInput
              id="confirmPassword"
              label="Confirm password *"
              placeholder="Confirm password"
              autoComplete="new-password"
              className="py-3 text-sm sm:text-base"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Recruiter information</h2>

          <RecruiterProfileFields register={register} errors={errors} />
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          By clicking Sign up, you agree to InterVue&apos;s{' '}
          <Link href="/terms" className="font-semibold text-[#00b14f] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="font-semibold text-[#00b14f] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          isLoading={isLoading}
          className="mt-5 w-full rounded-lg bg-[#00b14f] py-3.5 text-base font-bold text-white shadow-md shadow-[#00b14f]/25 transition hover:bg-[#009b45] sm:py-4 sm:text-lg"
        >
          Sign up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm font-medium text-slate-600 sm:text-base">
        <span>Already have an account? </span>
        <Link href={ROUTES.RECRUITER_LOGIN} className="font-bold text-[#00b14f] hover:underline">
          Sign in
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 text-center text-xs text-slate-600 sm:p-4 sm:text-sm">
        <span>Looking for a job? </span>
        <Link href={ROUTES.REGISTER} className="font-bold text-slate-900 hover:text-[#00b14f] hover:underline">
          Create a candidate account
        </Link>
      </div>
    </div>
  );
}
