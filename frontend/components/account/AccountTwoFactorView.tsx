'use client';

import { recruiterTwoFactorApi, userTwoFactorApi } from '@/apiRequest/two-factor';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import PasswordInput from '@/components/ui/PasswordInput';
import { isApiError } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import type { TrustedDevice, TwoFactorSetup, TwoFactorStatus } from '@/types/auth';
import { formatDate } from '@/utils/datetime';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Globe,
  KeyRound,
  Laptop,
  LogOut,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

type AccountTwoFactorViewProps = {
  portal?: 'candidate' | 'recruiter';
};

export default function AccountTwoFactorView({ portal = 'candidate' }: AccountTwoFactorViewProps) {
  const queryClient = useQueryClient();
  const isRecruiter = portal === 'recruiter';
  const api = isRecruiter ? recruiterTwoFactorApi : userTwoFactorApi;
  const statusQueryKey = [portal, 'two-factor-status'];
  const setupQueryKey = [portal, 'two-factor-setup'];
  const devicesQueryKey = ['recruiter', 'trusted-devices'];

  const { data: status, isLoading: isStatusLoading } = useQuery<TwoFactorStatus>({
    queryKey: statusQueryKey,
    queryFn: () => api.getStatus(),
  });

  const isEnabled = status?.enabled ?? false;

  const { data: setupData } = useQuery<TwoFactorSetup>({
    queryKey: setupQueryKey,
    queryFn: () => api.setup(),
    enabled: Boolean(status && !status.enabled),
    staleTime: Infinity,
  });

  const { data: trustedDevices, isLoading: isDevicesLoading } = useQuery<TrustedDevice[]>({
    queryKey: devicesQueryKey,
    queryFn: () => recruiterTwoFactorApi.getTrustedDevices(),
    enabled: isRecruiter && isEnabled,
  });

  const [otpCode, setOtpCode] = useState('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedBackup, setIsCopiedBackup] = useState(false);
  const [hasConfirmedBackup, setHasConfirmedBackup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Disable modal state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  // Reconfigure modal state (Recruiter)
  const [showReconfigureModal, setShowReconfigureModal] = useState(false);
  const [reconfigureStep, setReconfigureStep] = useState<'password' | 'scan'>('password');
  const [reconfigurePassword, setReconfigurePassword] = useState('');
  const [reconfigureSetupData, setReconfigureSetupData] = useState<TwoFactorSetup | null>(null);
  const [reconfigureOtp, setReconfigureOtp] = useState('');
  const [reconfigureError, setReconfigureError] = useState('');
  const [isReconfiguring, setIsReconfiguring] = useState(false);

  // Regenerate codes modal state (Recruiter)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerateStep, setRegenerateStep] = useState<'password' | 'codes'>('password');
  const [regeneratePassword, setRegeneratePassword] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const [regenerateError, setRegenerateError] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isCopiedNewCodes, setIsCopiedNewCodes] = useState(false);

  // Revoke device mutations (Recruiter)
  const revokeDeviceMutation = useMutation({
    mutationFn: (id: number) => recruiterTwoFactorApi.revokeTrustedDevice(id),
    onSuccess: () => {
      toast.success(isRecruiter ? 'Device trust revoked successfully.' : 'Đã thu hồi tin cậy thiết bị.');
      queryClient.invalidateQueries({ queryKey: devicesQueryKey });
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : 'Could not revoke device trust.');
    },
  });

  const revokeAllDevicesMutation = useMutation({
    mutationFn: () => recruiterTwoFactorApi.revokeAllTrustedDevices(),
    onSuccess: () => {
      toast.success(isRecruiter ? 'All trusted devices revoked.' : 'Đã thu hồi toàn bộ thiết bị tin cậy.');
      queryClient.invalidateQueries({ queryKey: devicesQueryKey });
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : 'Could not revoke trusted devices.');
    },
  });

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
    element.download = isRecruiter ? 'intervue-recruiter-recovery-codes.txt' : 'intervue-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim().length !== 6) {
      setErrorMsg(
        isRecruiter
          ? 'Please enter the complete 6-digit code from your authenticator app.'
          : 'Vui lòng nhập đủ 6 chữ số từ ứng dụng xác thực.',
      );
      return;
    }

    if (isRecruiter && !hasConfirmedBackup) {
      setErrorMsg('Please confirm that you have saved your emergency recovery codes before activating.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.confirm(otpCode.trim());
      toast.success(
        isRecruiter
          ? 'Two-factor authentication successfully enabled!'
          : 'Xác thực 2 bước đã được kích hoạt thành công!',
      );
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      queryClient.removeQueries({ queryKey: setupQueryKey });
      queryClient.invalidateQueries({ queryKey: devicesQueryKey });
      setOtpCode('');
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(
          err.message ||
            (isRecruiter ? 'Incorrect verification code. Please try again.' : 'Mã xác thực không chính xác.'),
        );
      } else {
        setErrorMsg(isRecruiter ? 'Failed to enable 2FA. Please try again.' : 'Lỗi kích hoạt xác thực 2 bước.');
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
      toast.success(isRecruiter ? 'Two-factor authentication disabled.' : 'Đã tắt xác thực 2 bước.');
      setShowDisableModal(false);
      setDisablePassword('');
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
      queryClient.removeQueries({ queryKey: setupQueryKey });
      queryClient.invalidateQueries({ queryKey: devicesQueryKey });
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(
          err.message || (isRecruiter ? 'Incorrect password. Please try again.' : 'Mật khẩu xác nhận không chính xác.'),
        );
      } else {
        setErrorMsg(isRecruiter ? 'Failed to disable 2FA.' : 'Lỗi tắt 2FA.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reconfigure initiation
  const handleInitiateReconfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconfigureError('');
    setIsReconfiguring(true);
    try {
      const res = await recruiterTwoFactorApi.initiateReconfigure(reconfigurePassword);
      setReconfigureSetupData(res);
      setReconfigureStep('scan');
      setReconfigurePassword('');
    } catch (err) {
      setReconfigureError(isApiError(err) ? err.message : 'Incorrect password.');
    } finally {
      setIsReconfiguring(false);
    }
  };

  // Reconfigure confirm
  const handleConfirmReconfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconfigureError('');
    setIsReconfiguring(true);
    try {
      await recruiterTwoFactorApi.confirmReconfigure(reconfigureOtp.trim());
      toast.success('Authenticator reconfigured successfully!');
      setShowReconfigureModal(false);
      setReconfigureStep('password');
      setReconfigureOtp('');
      setReconfigureSetupData(null);
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
    } catch (err) {
      setReconfigureError(isApiError(err) ? err.message : 'Invalid verification code.');
    } finally {
      setIsReconfiguring(false);
    }
  };

  // Regenerate recovery codes
  const handleRegenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegenerateError('');
    setIsRegenerating(true);
    try {
      const codes = await recruiterTwoFactorApi.regenerateRecoveryCodes(regeneratePassword);
      setNewBackupCodes(codes);
      setRegenerateStep('codes');
      setRegeneratePassword('');
      queryClient.invalidateQueries({ queryKey: statusQueryKey });
    } catch (err) {
      setRegenerateError(isApiError(err) ? err.message : 'Incorrect password.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary h-5 w-5" />
              <h1 className="text-on-surface text-xl font-bold sm:text-2xl">
                {isRecruiter ? 'Two-Factor Authentication (2FA)' : 'Xác thực 2 bước (2FA)'}
              </h1>
            </div>
            <p className="text-on-surface-variant mt-1 text-sm">
              {isRecruiter
                ? 'Protect your employer account with an additional layer of security via Google Authenticator, 1Password or Authy.'
                : 'Bảo vệ tài khoản bằng lớp bảo mật bổ sung qua ứng dụng Google Authenticator hoặc Microsoft Authenticator.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant={isStatusLoading ? 'default' : isEnabled ? 'success' : 'warning'} size="md">
              {isStatusLoading
                ? isRecruiter
                  ? 'Checking...'
                  : 'Đang kiểm tra...'
                : isEnabled
                  ? isRecruiter
                    ? '● Active'
                    : '● Đang kích hoạt'
                  : isRecruiter
                    ? '○ Not active'
                    : '○ Chưa kích hoạt'}
            </Badge>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="border-error/30 bg-error/10 text-error flex items-center gap-2.5 rounded-2xl border p-4 text-sm font-semibold">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {isStatusLoading ? (
        <div className="border-outline-variant rounded-2xl border bg-white p-12 text-center shadow-xs">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-on-surface-variant mt-3 text-xs font-semibold">
            {isRecruiter ? 'Checking security status...' : 'Đang kiểm tra trạng thái bảo mật...'}
          </p>
        </div>
      ) : isEnabled ? (
        <div className="space-y-6">
          {/* Active Status Card */}
          <div className="border-primary/30 rounded-2xl border bg-emerald-50/60 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="bg-primary shadow-elevation-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-on-surface text-lg font-bold">
                  {isRecruiter
                    ? 'Your employer account is protected with 2FA'
                    : 'Tài khoản của bạn đang được bảo vệ an toàn với 2FA'}
                </h3>
                <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
                  {isRecruiter
                    ? 'Primary method: Time-based One-Time Password (TOTP). Untrusted browsers and devices will be challenged for a 6-digit verification code.'
                    : 'Phương thức chính: Ứng dụng xác thực mã một lần (TOTP). Mỗi khi đăng nhập trên thiết bị mới, hệ thống sẽ yêu cầu mã từ điện thoại của bạn.'}
                </p>

                {status?.remainingBackupCodes !== undefined && (
                  <div className="text-on-surface-variant mt-3 flex items-center gap-2 text-xs font-semibold">
                    <span>
                      {isRecruiter ? 'Remaining emergency recovery codes:' : 'Số mã dự phòng còn lại:'}{' '}
                      <strong className="text-on-surface">{status.remainingBackupCodes}</strong>
                    </span>
                    {status.remainingBackupCodes <= 2 && (
                      <span className="text-label-sm rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                        {isRecruiter ? 'Low backup codes' : 'Sắp hết mã'}
                      </span>
                    )}
                  </div>
                )}

                {/* Management Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {isRecruiter && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReconfigureError('');
                          setShowReconfigureModal(true);
                        }}
                        leftIcon={<RefreshCw className="text-on-surface-variant h-3.5 w-3.5" />}
                      >
                        Reconfigure Authenticator
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRegenerateError('');
                          setShowRegenerateModal(true);
                        }}
                        leftIcon={<KeyRound className="text-on-surface-variant h-3.5 w-3.5" />}
                      >
                        Regenerate Backup Codes
                      </Button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDisableModal(true)}
                    className="text-error cursor-pointer text-xs font-bold transition hover:underline"
                  >
                    {isRecruiter ? 'Disable Two-Factor Authentication' : 'Tắt xác thực 2 bước'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted Devices Section (Recruiter Only) */}
          {isRecruiter && (
            <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-on-surface text-base font-bold">Trusted Browsers & Workstations</h2>
                  <p className="text-on-surface-variant text-xs">
                    Browsers remembered for 30 days that bypass two-factor verification at sign in.
                  </p>
                </div>

                {trustedDevices && trustedDevices.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    isLoading={revokeAllDevicesMutation.isPending}
                    onClick={() => revokeAllDevicesMutation.mutate()}
                    leftIcon={<LogOut className="h-3.5 w-3.5" />}
                    className="border-error/30 bg-error/10 text-error hover:bg-error/10 hover:text-error"
                  >
                    Revoke all trusted devices
                  </Button>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {isDevicesLoading ? (
                  <div className="space-y-3" aria-busy="true">
                    <div className="bg-surface-container-high h-16 animate-pulse rounded-xl" />
                    <div className="bg-surface-container-high h-16 animate-pulse rounded-xl" />
                  </div>
                ) : !trustedDevices || trustedDevices.length === 0 ? (
                  <div className="border-outline-variant bg-surface-container-low/60 text-on-surface-variant rounded-xl border border-dashed p-6 text-center text-xs">
                    No trusted browsers recorded yet. Check &quot;Trust this browser for 30 days&quot; during sign-in to
                    remember your workstation.
                  </div>
                ) : (
                  trustedDevices.map((device) => (
                    <div
                      key={device.id}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-xl border p-4 transition',
                        device.current
                          ? 'border-primary/30 bg-emerald-50/40'
                          : 'border-outline-variant bg-surface-container-low hover:bg-white',
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                            device.current
                              ? 'bg-primary-container text-primary'
                              : 'bg-surface-container-high text-on-surface-variant',
                          )}
                        >
                          <Laptop className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-on-surface truncate text-sm font-bold">{device.deviceName}</span>
                            {device.current && (
                              <span className="bg-primary text-label-sm shrink-0 rounded-full px-2 py-0.5 font-bold text-white">
                                This browser
                              </span>
                            )}
                          </div>
                          <div className="text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                            <span className="flex items-center gap-1">
                              <Globe className="text-outline h-3.5 w-3.5" />
                              {device.ipAddress}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="text-outline h-3.5 w-3.5" />
                              Expires: {formatDate(device.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!device.current && (
                        <button
                          type="button"
                          disabled={revokeDeviceMutation.isPending}
                          onClick={() => revokeDeviceMutation.mutate(device.id)}
                          className="text-error shrink-0 cursor-pointer text-xs font-bold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Revoke trust
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Inactive State: Step-by-Step Setup */
        <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-8">
          <h2 className="text-on-surface text-base font-bold">
            {isRecruiter
              ? 'Pair an authenticator application with your account'
              : 'Thiết lập ứng dụng xác thực trên điện thoại'}
          </h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            {isRecruiter
              ? 'Supports Google Authenticator, 1Password, Microsoft Authenticator & Authy.'
              : 'Hỗ trợ Google Authenticator, Microsoft Authenticator, 1Password hoặc Authy.'}
          </p>

          <div className="mt-6 space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <div className="text-on-surface text-sm font-bold">
                  {isRecruiter ? 'Scan the QR code with your authenticator app' : 'Mở ứng dụng xác thực và quét mã QR'}
                </div>
                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="border-outline-variant flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border bg-white p-3 shadow-xs">
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
                      <div className="text-outline flex flex-col items-center justify-center text-xs">
                        <QrCode className="text-outline h-8 w-8 animate-pulse" />
                        <span className="mt-2">{isRecruiter ? 'Generating QR code...' : 'Đang tạo mã QR...'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-on-surface-variant text-xs">
                      {isRecruiter
                        ? 'If you cannot scan the QR code, copy and paste this manual secret key into your app:'
                        : 'Nếu không thể quét mã QR, hãy sao chép mã khóa bí mật bên dưới và dán thủ công vào ứng dụng:'}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="border-outline-variant bg-surface-container-low text-on-surface rounded-lg border px-3 py-2 font-mono text-xs font-bold tracking-wider select-all">
                        {setupData?.secret || (isRecruiter ? 'Generating key...' : 'Đang tạo khóa...')}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyKey}
                        leftIcon={
                          isCopiedKey ? (
                            <Check className="text-primary h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )
                        }
                      >
                        {isCopiedKey ? (isRecruiter ? 'Copied' : 'Đã sao chép') : isRecruiter ? 'Copy key' : 'Sao chép'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            {setupData?.backupCodes && setupData.backupCodes.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-on-surface text-sm font-bold">
                        {isRecruiter ? 'Save your emergency recovery codes' : 'Lưu lại mã khôi phục dự phòng'}
                      </div>
                      <div className="text-on-surface-variant text-xs">
                        {isRecruiter
                          ? 'Each code can be used once if you ever lose access to your phone or authenticator app.'
                          : 'Sử dụng khi bạn mất điện thoại hoặc không truy cập được ứng dụng Authenticator.'}
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
                            <Check className="text-primary h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )
                        }
                      >
                        {isCopiedBackup
                          ? isRecruiter
                            ? 'Copied'
                            : 'Đã sao chép'
                          : isRecruiter
                            ? 'Copy all'
                            : 'Sao chép mã'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadBackupCodes}
                        leftIcon={<Download className="h-3.5 w-3.5" />}
                      >
                        {isRecruiter ? 'Download .txt' : 'Tải file .txt'}
                      </Button>
                    </div>
                  </div>

                  <div className="border-outline-variant bg-surface-container-low text-on-surface mt-3 grid grid-cols-2 gap-2 rounded-xl border p-3 font-mono text-xs font-bold sm:grid-cols-4">
                    {setupData.backupCodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="border-outline-variant/80 rounded-md border bg-white p-2 text-center shadow-2xs"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  {isRecruiter && (
                    <label className="text-on-surface-variant mt-3.5 flex cursor-pointer items-start gap-2 text-xs select-none">
                      <input
                        type="checkbox"
                        checked={hasConfirmedBackup}
                        onChange={(e) => setHasConfirmedBackup(e.target.checked)}
                        className="border-outline text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded"
                      />
                      <span>I have securely saved these 8 emergency recovery codes in a safe vault.</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <div className="text-on-surface text-sm font-bold">
                  {isRecruiter
                    ? 'Enter 6-digit verification code to activate'
                    : 'Nhập mã 6 chữ số để xác thực kích hoạt'}
                </div>
                <form onSubmit={handleVerifyAndEnable} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="text-on-surface w-48 text-center font-mono text-base font-bold tracking-widest"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-primary hover:bg-primary font-bold"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    {isRecruiter ? 'Activate Two-Factor Authentication' : 'Kích hoạt xác thực 2 bước'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <Modal
          isOpen={showDisableModal}
          onClose={() => setShowDisableModal(false)}
          title={isRecruiter ? 'Disable Two-Factor Authentication' : 'Tắt xác thực 2 bước'}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-on-surface-variant text-xs leading-relaxed">
              {isRecruiter
                ? 'Your account security will be lowered. Untrusted browsers will no longer be challenged. Please enter your password to confirm.'
                : 'Tài khoản của bạn sẽ giảm mức độ an toàn. Vui lòng nhập mật khẩu hiện tại để xác nhận.'}
            </p>

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <PasswordInput
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder={isRecruiter ? 'Enter your password' : 'Nhập mật khẩu của bạn'}
                required
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDisableModal(false)}>
                  {isRecruiter ? 'Cancel' : 'Hủy'}
                </Button>
                <Button type="submit" variant="danger" isLoading={isSubmitting}>
                  {isRecruiter ? 'Confirm and Disable' : 'Xác nhận tắt 2FA'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Reconfigure Modal (Recruiter) */}
      {showReconfigureModal && (
        <Modal
          isOpen={showReconfigureModal}
          onClose={() => {
            setShowReconfigureModal(false);
            setReconfigureStep('password');
            setReconfigurePassword('');
            setReconfigureOtp('');
            setReconfigureSetupData(null);
          }}
          title="Reconfigure Authenticator App"
          maxWidth="md"
        >
          {reconfigureStep === 'password' ? (
            <form onSubmit={handleInitiateReconfigure} className="space-y-4">
              <p className="text-on-surface-variant text-xs">
                To link a new phone or authenticator app, please confirm your current account password.
              </p>

              {reconfigureError && (
                <div className="border-error/30 bg-error/10 text-error rounded-xl border p-3 text-xs font-semibold">
                  {reconfigureError}
                </div>
              )}

              <PasswordInput
                label="Current Password"
                value={reconfigurePassword}
                onChange={(e) => setReconfigurePassword(e.target.value)}
                placeholder="Enter your current password"
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowReconfigureModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isReconfiguring} className="bg-primary hover:bg-primary font-bold">
                  Continue
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmReconfigure} className="space-y-5">
              <p className="text-on-surface-variant text-xs">
                Scan the new QR code with your authenticator app and enter the 6-digit code below:
              </p>

              {reconfigureError && (
                <div className="border-error/30 bg-error/10 text-error rounded-xl border p-3 text-xs font-semibold">
                  {reconfigureError}
                </div>
              )}

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="border-outline-variant flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl border bg-white p-2 shadow-xs">
                  {reconfigureSetupData?.qrCodeDataUrl ? (
                    <Image
                      src={reconfigureSetupData.qrCodeDataUrl}
                      alt="Reconfigure QR Code"
                      width={128}
                      height={128}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-on-surface-variant text-xs">Manual secret key:</div>
                  <code className="border-outline-variant bg-surface-container-low text-on-surface block rounded-lg border px-3 py-2 font-mono text-xs font-bold select-all">
                    {reconfigureSetupData?.secret}
                  </code>
                </div>
              </div>

              <div>
                <label className="text-on-surface-variant block text-xs font-bold tracking-wider uppercase">
                  6-Digit Verification Code
                </label>
                <div className="mt-1.5">
                  <Input
                    type="text"
                    value={reconfigureOtp}
                    onChange={(e) => setReconfigureOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    autoFocus
                    className="text-on-surface text-center font-mono text-base font-bold tracking-widest"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowReconfigureModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isReconfiguring} className="bg-primary hover:bg-primary font-bold">
                  Confirm and Switch Key
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Regenerate Recovery Codes Modal (Recruiter) */}
      {showRegenerateModal && (
        <Modal
          isOpen={showRegenerateModal}
          onClose={() => {
            setShowRegenerateModal(false);
            setRegenerateStep('password');
            setRegeneratePassword('');
            setNewBackupCodes([]);
          }}
          title="Regenerate Emergency Recovery Codes"
          maxWidth="md"
        >
          {regenerateStep === 'password' ? (
            <form onSubmit={handleRegenerateCodes} className="space-y-4">
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Regenerating new recovery codes will permanently invalidate and burn all previous codes. Enter your
                password to proceed.
              </p>

              {regenerateError && (
                <div className="border-error/30 bg-error/10 text-error rounded-xl border p-3 text-xs font-semibold">
                  {regenerateError}
                </div>
              )}

              <PasswordInput
                label="Account Password"
                value={regeneratePassword}
                onChange={(e) => setRegeneratePassword(e.target.value)}
                placeholder="Enter your account password"
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowRegenerateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isRegenerating} className="bg-primary hover:bg-primary font-bold">
                  Regenerate Codes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                Your old recovery codes have been revoked. Please save these 8 fresh codes immediately.
              </div>

              <div className="border-outline-variant bg-surface-container-low text-on-surface grid grid-cols-2 gap-2 rounded-xl border p-3 font-mono text-xs font-bold sm:grid-cols-4">
                {newBackupCodes.map((code, idx) => (
                  <div
                    key={idx}
                    className="border-outline-variant rounded-md border bg-white p-2 text-center shadow-2xs"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(newBackupCodes.join('\n'));
                      setIsCopiedNewCodes(true);
                      setTimeout(() => setIsCopiedNewCodes(false), 2000);
                    }}
                    leftIcon={
                      isCopiedNewCodes ? (
                        <Check className="text-primary h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )
                    }
                  >
                    {isCopiedNewCodes ? 'Copied' : 'Copy all'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([newBackupCodes.join('\n')], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = 'intervue-recruiter-fresh-recovery-codes.txt';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                  >
                    Download .txt
                  </Button>
                </div>

                <Button
                  type="button"
                  className="bg-primary hover:bg-primary font-bold"
                  onClick={() => setShowRegenerateModal(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
