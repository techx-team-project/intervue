'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Copy, Download, Info, QrCode, ShieldAlert, ShieldCheck, Smartphone } from 'lucide-react';

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
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#00b14f]" />
              <h1 className="text-xl font-black text-[#263a4d] sm:text-2xl">Xác thực 2 bước (2FA)</h1>
            </div>
            <p className="mt-1 text-[13.5px] text-[#64748b]">
              Thêm một lớp bảo vệ vững chắc ngoài mật khẩu, ngăn chặn xâm nhập trái phép kể cả khi mật khẩu bị lộ.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                isEnabled
                  ? 'border border-emerald-200 bg-emerald-50 text-[#00873c]'
                  : 'border border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {isEnabled ? '● Đang kích hoạt' : '○ Chưa kích hoạt'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13.5px] font-semibold text-[#00873c]">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00b14f]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* State: 2FA is Currently ENABLED */}
      {isEnabled ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00b14f] text-white shadow-md">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1e293b]">Tài khoản của bạn đã được bảo vệ bằng 2FA</h3>
                <p className="mt-1 text-[13.5px] text-[#64748b]">
                  Phương thức chính: Ứng dụng xác thực (Google / Microsoft Authenticator). Khi đăng nhập trên thiết bị
                  mới, hệ thống sẽ yêu cầu mã xác nhận từ điện thoại của bạn.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    className="cursor-pointer text-[13px] font-bold text-rose-600 hover:underline"
                  >
                    Tắt xác thực 2 bước
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Codes Section */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#263a4d]">Mã khôi phục dự phòng (Backup Codes)</h3>
                <p className="text-[13px] text-[#64748b]">
                  Lưu trữ các mã này ở nơi an toàn. Mỗi mã chỉ sử dụng được 1 lần khi bạn không thể truy cập điện thoại.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12.5px] font-semibold text-[#475569] transition-colors hover:bg-[#f8fafc]"
                >
                  {isCopiedBackup ? <Check className="h-3.5 w-3.5 text-[#00b14f]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopiedBackup ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupCodes}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12.5px] font-semibold text-[#475569] transition-colors hover:bg-[#f8fafc]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải .txt</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-4 font-mono text-[13px] font-bold text-[#334155] sm:grid-cols-4">
              {BACKUP_CODES.map((code, idx) => (
                <div key={idx} className="rounded-md bg-white p-2 text-center shadow-2xs">
                  {code}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* State: 2FA is NOT ENABLED (Setup Walkthrough) */
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-8">
          <h2 className="text-[16px] font-bold text-[#263a4d]">Kích hoạt xác thực qua Authenticator App</h2>
          <p className="mt-1 text-[13.5px] text-[#64748b]">
            Sử dụng Google Authenticator, Microsoft Authenticator hoặc 1Password trên điện thoại của bạn.
          </p>

          <div className="mt-6 space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-xs font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-[#263a4d]">Mở ứng dụng Authenticator và quét mã QR</div>
                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Clean Mock QR Code SVG */}
                  <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="26" height="26" fill="#263a4d" rx="4" />
                      <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="13" y="13" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Corner 2 */}
                      <rect x="69" y="5" width="26" height="26" fill="#263a4d" rx="4" />
                      <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="77" y="13" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Corner 3 */}
                      <rect x="5" y="69" width="26" height="26" fill="#263a4d" rx="4" />
                      <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                      <rect x="13" y="77" width="10" height="10" fill="#00b14f" rx="1" />
                      {/* Inner Random Matrix Bits */}
                      <rect x="38" y="10" width="8" height="8" fill="#263a4d" />
                      <rect x="52" y="14" width="8" height="8" fill="#00b14f" />
                      <rect x="38" y="38" width="12" height="12" fill="#00b14f" />
                      <rect x="55" y="38" width="8" height="12" fill="#263a4d" />
                      <rect x="10" y="38" width="8" height="8" fill="#263a4d" />
                      <rect x="22" y="44" width="8" height="8" fill="#00b14f" />
                      <rect x="38" y="60" width="8" height="8" fill="#263a4d" />
                      <rect x="52" y="66" width="12" height="8" fill="#00b14f" />
                      <rect x="68" y="48" width="8" height="8" fill="#263a4d" />
                      <rect x="80" y="60" width="12" height="12" fill="#263a4d" />
                      <rect x="68" y="78" width="8" height="8" fill="#00b14f" />
                      <rect x="82" y="38" width="8" height="8" fill="#00b14f" />
                    </svg>
                  </div>

                  {/* Manual Secret Key */}
                  <div className="space-y-2">
                    <span className="text-[13px] text-[#64748b]">
                      Nếu không quét được mã, bạn có thể nhập khóa thiết lập thủ công:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2 font-mono text-[14px] font-bold text-[#263a4d]">
                        {SECRET_KEY}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-[13px] font-semibold text-[#475569] transition-colors hover:bg-[#f8fafc]"
                      >
                        {isCopiedKey ? <Check className="h-4 w-4 text-[#00b14f]" /> : <Copy className="h-4 w-4" />}
                        <span>{isCopiedKey ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-xs font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-[#263a4d]">Nhập mã 6 chữ số từ ứng dụng để hoàn tất</div>

                {errorMsg && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-[13px] font-semibold text-rose-600">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleVerifyAndEnable} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-44 rounded-xl border border-[#dcdfe4] bg-white px-4 py-2.5 text-center font-mono text-lg font-bold tracking-widest text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#00b14f] px-6 py-2.5 text-[14px] font-bold text-white shadow-xs transition-colors hover:bg-[#009643] disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <span>Xác minh & Kích hoạt 2FA</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
