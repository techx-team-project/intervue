'use client';

import FormErrorAlert from '@/components/auth/FormErrorAlert';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { useChangePassword } from '@/hooks/useAccountSecurity';
import { setPasswordSchema, type SetPasswordFormData } from '@/schemas/auth.schema';
import type { OAuthPortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import PasswordRequirements, { PasswordStrengthMeter } from './security/PasswordRequirements';

const EMPTY_FORM: SetPasswordFormData = { password: '', confirmPassword: '' };

export default function SetPasswordView({ portal = 'candidate' }: { portal?: OAuthPortal }) {
  const changePassword = useChangePassword(portal);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_FORM,
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = handleSubmit((values) =>
    changePassword.mutate(values, {
      onSuccess: () => {
        reset(EMPTY_FORM);
        const { accessToken, user, setSession } = useAuthStore.getState();
        if (accessToken && user) setSession({ accessToken, user: { ...user, hasPassword: true } }, portal);
      },
      onError: (error) => applyFormError(error, setError, ['password', 'confirmPassword']),
    }),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="text-primary h-5 w-5" />
          <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Set password</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          You signed up with Google. Set a password to also sign in with email.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <FormErrorAlert message={errors.root?.message} />

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <PasswordInput
              label="New password"
              placeholder="Enter a new password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <PasswordInput
            label="Confirm new password"
            placeholder="Re-enter the new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <PasswordRequirements password={password} />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={changePassword.isPending}
            leftIcon={<Lock className="h-4 w-4" />}
          >
            Set password
          </Button>
        </form>
      </div>
    </div>
  );
}
