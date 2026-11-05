'use client';

import FormErrorAlert from '@/components/auth/FormErrorAlert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSendPhoneOtp } from '@/hooks/useAccountIdentity';
import { isApiError } from '@/lib/api-error';
import type { AuthPortal } from '@/lib/auth-portal';
import { sendPhoneOtpSchema, type SendPhoneOtpFormData } from '@/schemas/auth.schema';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type PhoneNumberStepProps = {
  portal: AuthPortal;
  initialPhone: string;
  onCancel: () => void;
  onSent: (phone: string) => void;
  onRateLimited: (seconds: number) => void;
};

export default function PhoneNumberStep({
  portal,
  initialPhone,
  onCancel,
  onSent,
  onRateLimited,
}: PhoneNumberStepProps) {
  const sendOtp = useSendPhoneOtp(portal);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SendPhoneOtpFormData>({
    resolver: zodResolver(sendPhoneOtpSchema),
    mode: 'onTouched',
    defaultValues: { phone: initialPhone },
  });

  const onSubmit = handleSubmit(({ phone }) =>
    sendOtp.mutate(phone, {
      onSuccess: () => onSent(phone),
      onError: (error) => {
        if (isApiError(error) && error.retryAfter) onRateLimited(error.retryAfter);
        applyFormError(error, setError, ['phone']);
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormErrorAlert message={errors.root?.message} />
      <Input
        label="Phone number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="0912345678"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={sendOtp.isPending}>
          Send code
        </Button>
      </div>
    </form>
  );
}
