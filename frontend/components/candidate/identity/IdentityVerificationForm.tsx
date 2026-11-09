'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitIdentityVerification } from '@/hooks/useIdentityVerification';
import { identityMaxBirthDate, identityVerificationSchema } from '@/schemas/identity-verification.schema';
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
      onSuccess: () => toast.success('Đã gửi hồ sơ xác thực. Quản trị viên sẽ duyệt trong vòng 24 giờ làm việc.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Họ và tên (đúng như trên giấy tờ)"
          value={fullName}
          error={errors.fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
        <Input
          label="Số CCCD / CMND"
          inputMode="numeric"
          maxLength={12}
          value={idNumber}
          error={errors.idNumber}
          onChange={(event) => setIdNumber(event.target.value.replace(/\D/g, ''))}
        />
        <Input
          label="Ngày sinh"
          type="date"
          max={identityMaxBirthDate()}
          value={dateOfBirth}
          error={errors.dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <IdentityImageField
          label="CCCD mặt trước"
          hint="Chụp rõ, đủ bốn góc"
          file={front}
          error={errors.front}
          onChange={setFront}
        />
        <IdentityImageField
          label="CCCD mặt sau"
          hint="Chụp rõ, không chói sáng"
          file={back}
          error={errors.back}
          onChange={setBack}
        />
        <IdentityImageField
          label="Ảnh chân dung"
          hint="Cầm CCCD cạnh khuôn mặt"
          file={selfie}
          error={errors.selfie}
          onChange={setSelfie}
        />
      </div>

      <p className="text-on-surface-variant text-xs">
        Ảnh JPG hoặc PNG, tối đa 5MB mỗi ảnh. Hồ sơ chỉ quản trị viên xem được và dùng để xác thực danh tính của bạn.
      </p>

      <Button type="submit" disabled={submit.isPending}>
        {submit.isPending ? 'Đang gửi...' : 'Gửi hồ sơ xác thực'}
      </Button>
    </form>
  );
}
