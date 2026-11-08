'use client';

import FormErrorAlert from '@/components/auth/FormErrorAlert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSendPhoneOtp, useVerifyPhoneOtp } from '@/hooks/useAccountIdentity';
import { isApiError } from '@/lib/api-error';
import type { AuthPortal } from '@/lib/auth-portal';
import { verifyPhoneOtpSchema, type VerifyPhoneOtpFormData } from '@/schemas/auth.schema';
import { applyFormError, getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type PhoneCodeStepProps = {
  portal: AuthPortal;
  phone: string;
  cooldown: number;
  onCooldown: (seconds: number) => void;
  onBack: () => void;
  onVerified: () => void;
};

export default function PhoneCodeStep({ portal, phone, cooldown, onCooldown, onBack, onVerified }: PhoneCodeStepProps) {
  const verifyOtp = useVerifyPhoneOtp(portal);
  const resendOtp = useSendPhoneOtp(portal);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyPhoneOtpFormData>({
    resolver: zodResolver(verifyPhoneOtpSchema),
    mode: 'onTouched',
    defaultValues: { code: '' },
  });

  const onSubmit = handleSubmit(({ code }) =>
    verifyOtp.mutate(code, {
      onSuccess: onVerified,
      onError: (error) => applyFormError(error, setError, ['code']),
    }),
  );

  const resend = () =>
    resendOtp.mutate(phone, {
      onSuccess: () => toast.success('Verification code sent successfully!'),
      onError: (error) => {
        if (isApiError(error) && error.retryAfter) onCooldown(error.retryAfter);
        toast.error(getErrorMessage(error));
      },
    });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormErrorAlert message={errors.root?.message} />
      <p className="text-on-surface-variant text-sm">
        Enter the 6-digit code we sent to <span className="text-on-surface font-semibold">{phone}</span>.
      </p>
      <Input
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        error={errors.code?.message}
        {...register('code')}
      />
      <button
        type="button"
        disabled={cooldown > 0 || resendOtp.isPending}
        onClick={resend}
        className="text-primary disabled:text-outline cursor-pointer text-xs font-semibold hover:underline disabled:cursor-not-allowed disabled:no-underline"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onBack}>
          Change number
        </Button>
        <Button type="submit" isLoading={verifyOtp.isPending}>
          Verify
        </Button>
      </div>
    </form>
  );
}
