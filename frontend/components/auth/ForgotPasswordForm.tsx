'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RESEND_COOLDOWN_SECONDS } from '@/constants/auth';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/auth.schema';
import { applyFormError, getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormErrorAlert from './FormErrorAlert';

type ForgotPasswordFormProps = { portal?: AuthPortal };

export default function ForgotPasswordForm({ portal = 'candidate' }: ForgotPasswordFormProps) {
  const forgotPassword = useForgotPassword(portal);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = handleSubmit((values) =>
    forgotPassword.mutate(values, {
      onSuccess: () => {
        setSentEmail(values.email);
        setCountdown(RESEND_COOLDOWN_SECONDS);
      },
      onError: (error) => applyFormError(error, setError, ['email']),
    }),
  );

  const handleResend = () => {
    if (!sentEmail || countdown > 0) return;
    forgotPassword.mutate(
      { email: sentEmail },
      {
        onSuccess: () => {
          setCountdown(RESEND_COOLDOWN_SECONDS);
          toast.success('Recovery link sent again.');
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <div className="w-full">
      <p className="text-on-surface-variant mb-5 text-center text-sm leading-relaxed">
        Enter the email you registered with to receive a secure password reset link.
      </p>

      {sentEmail ? (
        <div className="border-primary/30 space-y-4 rounded-2xl border bg-emerald-50/70 p-6 text-center">
          <div className="bg-primary-container text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <h3 className="text-on-surface text-base font-bold">Recovery link sent</h3>
            <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
              If <strong>{sentEmail}</strong> is registered, you will receive a password reset link within a few
              minutes.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={countdown > 0 || forgotPassword.isPending}
              onClick={handleResend}
              className="text-primary disabled:text-outline text-sm font-semibold transition-colors enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend email'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormErrorAlert message={errors.root?.message} />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            isLoading={forgotPassword.isPending}
            className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
            rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
          >
            Send recovery link
          </Button>
        </form>
      )}

      <div className="mt-5 text-center">
        <Link
          href={AUTH_PORTAL_ROUTES[portal].login}
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}
