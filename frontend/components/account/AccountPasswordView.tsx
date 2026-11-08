'use client';

import FormErrorAlert from '@/components/auth/FormErrorAlert';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { useChangePassword } from '@/hooks/useAccountSecurity';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import { changePasswordSchema, type ChangePasswordFormData } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, KeyRound, Lock } from 'lucide-react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import SetPasswordView from './SetPasswordView';
import PasswordRequirements, { PasswordStrengthMeter } from './security/PasswordRequirements';

type AccountPasswordViewProps = { portal?: AuthPortal };

const EMPTY_FORM: ChangePasswordFormData = { currentPassword: '', password: '', confirmPassword: '' };

export default function AccountPasswordView({ portal = 'candidate' }: AccountPasswordViewProps) {
  const { user } = useAuth();
  if (portal !== 'admin' && user?.hasPassword === false) return <SetPasswordView portal={portal} />;
  return <ChangePasswordView portal={portal} />;
}

function ChangePasswordView({ portal }: { portal: AuthPortal }) {
  const changePassword = useChangePassword(portal);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_FORM,
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = handleSubmit((values) =>
    changePassword.mutate(values, {
      onSuccess: () => reset(EMPTY_FORM),
      onError: (error) => applyFormError(error, setError, ['currentPassword', 'password', 'confirmPassword']),
    }),
  );

  const handleCancel = () => {
    reset(EMPTY_FORM);
    clearErrors();
  };

  return (
    <div className="space-y-6">
      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="text-primary h-5 w-5" />
          <h1 className="text-on-surface text-xl font-bold sm:text-2xl">Change password</h1>
        </div>
        <p className="text-on-surface-variant mt-1 text-sm">
          To keep your profile and privacy safe, choose a strong password that you have never used anywhere else.
        </p>
      </div>

      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-8">
        <FormErrorAlert message={errors.root?.message} />

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <PasswordInput
              label="Current password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <div className="mt-1.5 text-right">
              <Link
                href={AUTH_PORTAL_ROUTES[portal].forgotPassword}
                className="text-primary text-xs font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

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

          <p className="text-on-surface-variant flex items-center gap-2 text-xs">
            <Info className="text-outline h-4 w-4 shrink-0" />
            <span>Changing your password signs you out of every other device.</span>
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={changePassword.isPending}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Update password
            </Button>

            <Button type="button" variant="outline" size="md" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
