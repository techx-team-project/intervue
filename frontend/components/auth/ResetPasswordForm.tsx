'use client';

import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { ROUTES } from '@/constants/routes';
import { useResetPassword } from '@/hooks/useResetPassword';
import { ResetPasswordFormData, resetPasswordSchema } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import FormErrorAlert from './FormErrorAlert';
import InvalidLinkNotice from './InvalidLinkNotice';

type ResetPasswordFormProps = { token?: string };

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <InvalidLinkNotice
        message="The password reset link is invalid. Please request a new one."
        actionHref={ROUTES.FORGOT_PASSWORD}
        actionLabel="Request a new link"
      />
    );
  }

  const onSubmit = handleSubmit((values) =>
    resetPassword.mutate(
      { ...values, token },
      { onError: (error) => applyFormError(error, setError, ['password', 'confirmPassword']) },
    ),
  );

  return (
    <div className="w-full">
      <p className="mb-5 text-center text-sm leading-relaxed text-slate-500">
        Create a new password for your account. All signed-in devices will be signed out after the change.
      </p>

      <FormErrorAlert message={errors.root?.message} />

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <PasswordInput
          label="New password"
          placeholder="At least 8 characters with upper, lower, digit and special"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm new password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          isLoading={resetPassword.isPending}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Reset password
        </Button>
      </form>
    </div>
  );
}
