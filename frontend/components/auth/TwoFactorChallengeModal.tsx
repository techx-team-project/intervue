'use client';

import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { isApiError } from '@/lib/api-error';
import type { AuthSession } from '@/types/auth';
import { CheckCircle2, KeyRound, Smartphone } from 'lucide-react';
import React, { useState } from 'react';

type TwoFactorChallengeModalProps = {
  isOpen: boolean;
  tempToken: string;
  portal: 'candidate' | 'recruiter';
  onSuccess: (session: AuthSession) => void;
  onCancel: () => void;
};

export default function TwoFactorChallengeModal({
  isOpen,
  tempToken,
  portal,
  onSuccess,
  onCancel,
}: TwoFactorChallengeModalProps) {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg(useBackupCode ? 'Vui lòng nhập mã khôi phục.' : 'Vui lòng nhập mã 6 số từ ứng dụng.');
      return;
    }

    setIsLoading(true);
    try {
      const verifyFn = portal === 'recruiter' ? recruiterAuthApi.verifyTwoFactor : authApi.verifyTwoFactor;
      const session = await verifyFn({
        tempToken,
        code: code.trim(),
      });
      onSuccess(session);
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(err.message || 'Mã xác thực không hợp lệ.');
      } else {
        setErrorMsg('Lỗi xác thực, vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Xác thực 2 bước (2FA)" maxWidth="sm">
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {useBackupCode ? <KeyRound className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {useBackupCode
              ? 'Nhập mã khôi phục 8 ký tự bạn đã lưu khi kích hoạt 2FA.'
              : 'Tài khoản của bạn đã kích hoạt bảo vệ 2 lớp. Vui lòng nhập mã 6 chữ số từ ứng dụng xác thực trên điện thoại.'}
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
              {useBackupCode ? 'Mã dự phòng (Backup Code)' : 'Mã 6 chữ số'}
            </label>
            <div className="mt-1.5">
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={useBackupCode ? '8912-4019' : '123456'}
                required
                autoFocus
                maxLength={useBackupCode ? 12 : 6}
                className="text-center font-mono text-base font-bold tracking-widest text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode('');
                setErrorMsg('');
              }}
              className="cursor-pointer font-semibold text-emerald-600 hover:underline"
            >
              {useBackupCode ? 'Dùng ứng dụng xác thực' : 'Dùng mã khôi phục dự phòng'}
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-emerald-600 font-bold hover:bg-emerald-500"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
