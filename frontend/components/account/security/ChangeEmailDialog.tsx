'use client';

import FormErrorAlert from '@/components/auth/FormErrorAlert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import PasswordInput from '@/components/ui/PasswordInput';
import SetPasswordNotice from '@/components/account/SetPasswordNotice';
import { useAuth } from '@/hooks/useAuth';
import { useRequestEmailChange } from '@/hooks/useAccountIdentity';
import type { AuthPortal } from '@/lib/auth-portal';
import { changeEmailSchema, type ChangeEmailFormData } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type ChangeEmailDialogProps = { isOpen: boolean; onClose: () => void; portal: AuthPortal; currentEmail: string };

const EMPTY_FORM: ChangeEmailFormData = { newEmail: '', currentPassword: '' };

export default function ChangeEmailDialog({ isOpen, onClose, portal, currentEmail }: ChangeEmailDialogProps) {
  const requestEmailChange = useRequestEmailChange(portal);
  const { user } = useAuth();
  const needsPassword = portal === 'candidate' && user?.hasPassword === false;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_FORM,
  });

  const handleClose = () => {
    reset(EMPTY_FORM);
    onClose();
  };

  const onSubmit = handleSubmit((values) =>
    requestEmailChange.mutate(values, {
      onSuccess: handleClose,
      onError: (error) => applyFormError(error, setError, ['newEmail', 'currentPassword']),
    }),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change email"
      description={`Current email: ${currentEmail}. We will send a confirmation link to the new address.`}
    >
      {needsPassword ? (
        <SetPasswordNotice />
      ) : (
        <>
          <FormErrorAlert message={errors.root?.message} />
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <Input
              label="New email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.newEmail?.message}
              {...register('newEmail')}
            />
            <PasswordInput
              label="Current password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <p className="text-xs text-slate-500">
              The link is valid for 24 hours. After you confirm it, you will be signed out of every device.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={requestEmailChange.isPending}>
                Send confirmation link
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
