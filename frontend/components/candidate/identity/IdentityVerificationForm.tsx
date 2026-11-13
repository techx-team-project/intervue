'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitIdentityVerification } from '@/hooks/useIdentityVerification';
import {
  IDENTITY_MIN_BIRTH_DATE,
  identityMaxBirthDate,
  identityVerificationSchema,
} from '@/schemas/identity-verification.schema';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';
import IdentityImageField from './IdentityImageField';

type FieldErrors = Partial<Record<'fullName' | 'idNumber' | 'dateOfBirth' | 'front' | 'back' | 'selfie', string>>;

export default function IdentityVerificationForm({ initialName }: { initialName?: string }) {
  const { user } = useAuth();
  const submit = useSubmitIdentityVerification();
  const [fullName, setFullName] = useState(initialName ?? user?.name ?? '');
  const [idNumber, setIdNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = identityVerificationSchema.safeParse({ fullName, idNumber, dateOfBirth, front, back, selfie });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    submit.mutate(parsed.data, {
      onSuccess: () => toast.success('Verification submitted. An admin will review it within 24 working hours.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name (as on the document)"
          value={fullName}
          error={errors.fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
        <Input
          label="ID number (CCCD / CMND)"
          inputMode="numeric"
          maxLength={12}
          value={idNumber}
          error={errors.idNumber}
          onChange={(event) => setIdNumber(event.target.value.replace(/\D/g, ''))}
        />
        <Input
          label="Date of birth"
          type="date"
          min={IDENTITY_MIN_BIRTH_DATE}
          max={identityMaxBirthDate()}
          value={dateOfBirth}
          error={errors.dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <IdentityImageField
          label="ID card, front"
          hint="Clear photo, all four corners visible"
          file={front}
          error={errors.front}
          onChange={setFront}
        />
        <IdentityImageField
          label="ID card, back"
          hint="Clear photo, no glare"
          file={back}
          error={errors.back}
          onChange={setBack}
        />
        <IdentityImageField
          label="Selfie"
          hint="Hold the ID card next to your face"
          file={selfie}
          error={errors.selfie}
          onChange={setSelfie}
        />
      </div>

      <p className="text-on-surface-variant text-xs">
        JPG or PNG images, up to 5 MB each. Only admins can see them, and they are used only to verify your identity.
      </p>

      <Button type="submit" disabled={submit.isPending}>
        {submit.isPending ? 'Sending...' : 'Submit for verification'}
      </Button>
    </form>
  );
}
