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
  const [trustDevice, setTrustDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg(
        useBackupCode
          ? portal === 'recruiter'
            ? 'Please enter your emergency recovery code.'
            : 'Vui lòng nhập mã khôi phục.'
          : portal === 'recruiter'
            ? 'Please enter the 6-digit verification code from your app.'
            : 'Vui lòng nhập mã 6 số từ ứng dụng.',
      );
      return;
    }

    setIsLoading(true);
    try {
      const verifyFn = portal === 'recruiter' ? recruiterAuthApi.verifyTwoFactor : authApi.verifyTwoFactor;
      const session = await verifyFn({
        tempToken,
        code: code.trim(),
        trustDevice: portal === 'recruiter' ? trustDevice : undefined,
      });
      onSuccess(session);
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(
          err.message ||
            (portal === 'recruiter' ? 'Invalid verification code or recovery code.' : 'Mã xác thực không hợp lệ.'),
        );
      } else {
        setErrorMsg(
          portal === 'recruiter' ? 'Authentication error. Please try again.' : 'Lỗi xác thực, vui lòng thử lại.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isRecruiter = portal === 'recruiter';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={isRecruiter ? 'Two-Factor Authentication (2FA)' : 'Xác thực 2 bước (2FA)'}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {useBackupCode ? <KeyRound className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {useBackupCode
              ? isRecruiter
                ? 'Enter one of your 8-character single-use emergency recovery codes saved during setup.'
                : 'Nhập mã khôi phục 8 ký tự bạn đã lưu khi kích hoạt 2FA.'
              : isRecruiter
                ? 'Your account is protected with two-factor authentication. Enter the 6-digit code from Google/Microsoft Authenticator or 1Password.'
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
              {useBackupCode
                ? isRecruiter
                  ? 'Emergency Recovery Code'
                  : 'Mã dự phòng (Backup Code)'
                : isRecruiter
                  ? '6-Digit Verification Code'
                  : 'Mã 6 chữ số'}
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

          {isRecruiter && (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs transition select-none hover:bg-slate-50">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">Trust this browser for 30 days</span>
                <span className="text-[11px] text-slate-500">
                  Do not challenge for 2FA on this workstation or laptop for the next 30 days.
                </span>
              </div>
            </label>
          )}

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
              {useBackupCode
                ? isRecruiter
                  ? 'Use authenticator app code'
                  : 'Dùng ứng dụng xác thực'
                : isRecruiter
                  ? 'Use emergency recovery code'
                  : 'Dùng mã khôi phục dự phòng'}
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {isRecruiter ? 'Cancel' : 'Hủy'}
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-emerald-600 font-bold hover:bg-emerald-500"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {isRecruiter ? 'Verify and Sign in' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
