'use client';

import { recruiterTwoFactorApi, userTwoFactorApi } from '@/apiRequest/two-factor';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { isApiError } from '@/lib/api-error';
import type { TwoFactorSetup, TwoFactorStatus } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, CheckCircle2, Copy, Download, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

type AccountTwoFactorViewProps = {
  portal?: 'candidate' | 'recruiter';
};

export default function AccountTwoFactorView({ portal = 'candidate' }: AccountTwoFactorViewProps) {
  const queryClient = useQueryClient();
  const api = portal === 'recruiter' ? recruiterTwoFactorApi : userTwoFactorApi;
  const statusQueryKey = [portal, 'two-factor-status'];
  const setupQueryKey = [portal, 'two-factor-setup'];

  const { data: status, isLoading: isStatusLoading } = useQuery<TwoFactorStatus>({
    queryKey: statusQueryKey,
    queryFn: () => api.getStatus(),
  });

  const isEnabled = status?.enabled ?? false;

  const { data: setupData } = useQuery<TwoFactorSetup>({
    queryKey: setupQueryKey,
    queryFn: () => api.setup(),
    enabled: !isEnabled && !isStatusLoading,
    staleTime: Infinity,
  });

  const [otpCode, setOtpCode] = useState('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedBackup, setIsCopiedBackup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Disable modal state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const handleCopyKey = () => {
    if (!setupData?.secret) return;
    navigator.clipboard.writeText(setupData.secret);
    setIsCopiedKey(true);
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
    setIsCopiedBackup(true);
    setTimeout(() => setIsCopiedBackup(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    const element = document.createElement('a');
    const file = new Blob([setupData.backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'intervue-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim().length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số từ ứng dụng xác thực.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.confirm(otpCode.trim());
      toast.success('Xác thực 2 bước đã được kích hoạt thành công!');
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      queryClient.invalidateQueries({ queryKey: setupQueryKey });
      setOtpCode('');
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(err.message || 'Mã xác thực không chính xác.');
      } else {
        setErrorMsg('Lỗi kích hoạt xác thực 2 bước.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.disable(disablePassword);
      toast.success('Đã tắt xác thực 2 bước.');
      setShowDisableModal(false);
      setDisablePassword('');
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      queryClient.invalidateQueries({ queryKey: setupQueryKey });
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(err.message || 'Mật khẩu xác nhận không chính xác.');
      } else {
        setErrorMsg('Lỗi tắt 2FA.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-600" />
              <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Xác thực 2 bước (2FA)</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Bảo vệ tài khoản bằng lớp bảo mật bổ sung qua ứng dụng Google Authenticator hoặc Microsoft Authenticator.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant={isEnabled ? 'success' : 'warning'} size="md">
              {isEnabled ? '● Đang kích hoạt' : '○ Chưa kích hoạt'}
            </Badge>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {isEnabled ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Tài khoản của bạn đang được bảo vệ an toàn với 2FA</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Phương thức chính: Ứng dụng xác thực mã một lần (TOTP). Mỗi khi đăng nhập trên thiết bị mới, hệ thống
                  sẽ yêu cầu mã từ điện thoại của bạn.
                </p>
                {status?.remainingBackupCodes !== undefined && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Số mã dự phòng còn lại:{' '}
                    <span className="font-bold text-slate-800">{status.remainingBackupCodes}</span>
                  </p>
                )}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDisableModal(true)}
                    className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
                  >
                    Tắt xác thực 2 bước
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <h2 className="text-base font-bold text-slate-800">Thiết lập ứng dụng xác thực trên điện thoại</h2>
          <p className="mt-1 text-sm text-slate-500">
            Hỗ trợ Google Authenticator, Microsoft Authenticator, 1Password hoặc Authy.
          </p>

          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">Mở ứng dụng xác thực và quét mã QR</div>
                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                    {setupData?.qrCodeDataUrl ? (
                      <Image
                        src={setupData.qrCodeDataUrl}
                        alt="2FA QR Code"
                        width={160}
                        height={160}
                        unoptimized
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-xs text-slate-400">
                        <QrCode className="h-8 w-8 animate-pulse text-slate-300" />
                        <span className="mt-2">Đang tạo mã QR...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-xs text-slate-500">
                      Nếu không thể quét mã QR, hãy sao chép mã khóa bí mật bên dưới và dán thủ công vào ứng dụng:
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-bold tracking-wider text-slate-800 select-all">
                        {setupData?.secret || 'Đang tạo khóa...'}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyKey}
                        leftIcon={
                          isCopiedKey ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )
                        }
                      >
                        {isCopiedKey ? 'Đã sao chép' : 'Sao chép'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {setupData?.backupCodes && setupData.backupCodes.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-800">Lưu lại mã khôi phục dự phòng</div>
                      <div className="text-xs text-slate-500">
                        Sử dụng khi bạn mất điện thoại hoặc không truy cập được ứng dụng Authenticator.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyBackupCodes}
                        leftIcon={
                          isCopiedBackup ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )
                        }
                      >
                        {isCopiedBackup ? 'Đã sao chép' : 'Sao chép mã'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadBackupCodes}
                        leftIcon={<Download className="h-3.5 w-3.5" />}
                      >
                        Tải file .txt
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 font-mono text-xs font-bold text-slate-700 sm:grid-cols-4">
                    {setupData.backupCodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-slate-200/80 bg-white p-2 text-center shadow-2xs"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">Nhập mã 6 chữ số để xác thực kích hoạt</div>
                <form onSubmit={handleVerifyAndEnable} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-48 text-center font-mono text-base font-bold tracking-widest text-slate-900"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-emerald-600 font-bold hover:bg-emerald-500"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Kích hoạt xác thực 2 bước
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <h3 className="text-lg font-bold text-slate-900">Tắt xác thực 2 bước</h3>
            <p className="mt-2 text-xs text-slate-500">
              Tài khoản của bạn sẽ giảm mức độ an toàn. Vui lòng nhập mật khẩu hiện tại để xác nhận.
            </p>

            <form onSubmit={handleDisable2FA} className="mt-4 space-y-4">
              <PasswordInput
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDisableModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="danger" isLoading={isSubmitting}>
                  Xác nhận tắt 2FA
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
