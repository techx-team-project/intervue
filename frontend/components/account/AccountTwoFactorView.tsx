'use client';

import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, Download, ShieldCheck, Smartphone } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const SECRET_KEY = 'IV26-9A8F-4C21-7890';
const BACKUP_CODES = [
  '8912-4019',
  '5521-8842',
  '9021-3411',
  '1209-7743',
  '6619-2044',
  '3409-1822',
  '7891-6623',
  '4419-0931',
];

export default function AccountTwoFactorView() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedBackup, setIsCopiedBackup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SECRET_KEY);
    setIsCopiedKey(true);
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(BACKUP_CODES.join('\n'));
    setIsCopiedBackup(true);
    setTimeout(() => setIsCopiedBackup(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([BACKUP_CODES.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'intervue-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleVerifyAndEnable = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực từ ứng dụng Authenticator.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsEnabled(true);
      setSuccessMsg('Đã kích hoạt xác thực 2 bước (2FA) thành công! Tài khoản của bạn được bảo vệ tối đa.');
    }, 800);
  };

  const handleDisable2FA = () => {
    if (confirm('Bạn có chắc chắn muốn tắt xác thực 2 bước? Tài khoản sẽ giảm mức độ an toàn.')) {
      setIsEnabled(false);
      setOtpCode('');
      setSuccessMsg('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary h-5 w-5" />
              <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Xác thực 2 bước (2FA)</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Thêm một lớp bảo vệ vững chắc ngoài mật khẩu, ngăn chặn xâm nhập trái phép kể cả khi mật khẩu bị lộ.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant={isEnabled ? 'success' : 'warning'} size="md">
              {isEnabled ? '● Đang kích hoạt' : '○ Chưa kích hoạt'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* State: 2FA is Currently ENABLED */}
      {isEnabled ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tài khoản của bạn đã được bảo vệ bằng 2FA</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Phương thức chính: Ứng dụng xác thực (Google / Microsoft Authenticator). Khi đăng nhập trên thiết bị
                  mới, hệ thống sẽ yêu cầu mã xác nhận từ điện thoại của bạn.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
                  >
                    Tắt xác thực 2 bước
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Codes Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Mã khôi phục dự phòng (Backup Codes)</h3>
                <p className="text-xs text-slate-500">
                  Lưu trữ các mã này ở nơi an toàn. Mỗi mã chỉ sử dụng được 1 lần khi bạn không thể truy cập điện thoại.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBackupCodes}
                  leftIcon={
                    isCopiedBackup ? <Check className="text-primary h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />
                  }
                >
                  {isCopiedBackup ? 'Đã sao chép' : 'Sao chép'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadBackupCodes}
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                >
                  Tải .txt
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs font-bold text-slate-700 sm:grid-cols-4">
              {BACKUP_CODES.map((code, idx) => (
                <div key={idx} className="rounded-md border border-slate-200/60 bg-white p-2 text-center shadow-2xs">
                  {code}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* State: 2FA is NOT ENABLED (Setup Walkthrough) */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <h2 className="text-base font-bold text-slate-800">Kích hoạt xác thực qua Authenticator App</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sử dụng Google Authenticator, Microsoft Authenticator hoặc 1Password trên điện thoại của bạn.
          </p>

          <div className="mt-6 space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">Mở ứng dụng Authenticator và quét mã QR</div>
                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Clean Mock QR Code SVG */}
                  <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="26" height="26" fill="#1e293b" rx="4" />
                      <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="13" y="13" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Corner 2 */}
                      <rect x="69" y="5" width="26" height="26" fill="#1e293b" rx="4" />
                      <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="77" y="13" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Corner 3 */}
                      <rect x="5" y="69" width="26" height="26" fill="#1e293b" rx="4" />
                      <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                      <rect x="13" y="77" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Inner Random Matrix Bits */}
                      <rect x="38" y="10" width="8" height="8" fill="#1e293b" />
                      <rect x="52" y="14" width="8" height="8" fill="#00b14f" />
                      <rect x="38" y="38" width="12" height="12" fill="#00b14f" />
                      <rect x="55" y="38" width="8" height="12" fill="#1e293b" />
                      <rect x="10" y="38" width="8" height="8" fill="#1e293b" />
                      <rect x="22" y="44" width="8" height="8" fill="#00b14f" />
                      <rect x="38" y="60" width="8" height="8" fill="#1e293b" />
                      <rect x="52" y="66" width="12" height="8" fill="#00b14f" />
                      <rect x="68" y="48" width="8" height="8" fill="#1e293b" />
                      <rect x="80" y="60" width="12" height="12" fill="#1e293b" />
                      <rect x="68" y="78" width="8" height="8" fill="#00b14f" />
                      <rect x="82" y="38" width="8" height="8" fill="#00b14f" />
                    </svg>
                  </div>

                  {/* Manual Secret Key */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-500">
                      Nếu không quét được mã, bạn có thể nhập khóa thiết lập thủ công:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-sm font-bold text-slate-800">
                        {SECRET_KEY}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyKey}
                        leftIcon={
                          isCopiedKey ? <Check className="text-primary h-4 w-4" /> : <Copy className="h-4 w-4" />
                        }
                      >
                        {isCopiedKey ? 'Đã chép' : 'Sao chép'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">Nhập mã 6 chữ số từ ứng dụng để hoàn tất</div>

                {errorMsg && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-600">{errorMsg}</div>
                )}

                <form onSubmit={handleVerifyAndEnable} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="focus:border-primary focus:ring-primary w-44 rounded-xl border border-slate-300 bg-white px-4 py-2 text-center font-mono text-lg font-bold tracking-widest text-slate-800 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none"
                  />

                  <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                    Xác minh & Kích hoạt 2FA
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
