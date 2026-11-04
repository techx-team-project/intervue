'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import { BarChart3, CheckCircle2, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const VIETNAM_MOBILE_REGEX = /^0[35789]\d{8}$/;

export function PhoneVerificationView() {
  const { profile, handleSendPhoneOtp, handleVerifyPhone } = useCompanyVerification();

  const [phoneNumber, setPhoneNumber] = useState(profile.phone.phoneNumber || '');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(!profile.phone.isVerified);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (!isOtpSent || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const handleSendOtp = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed || !VIETNAM_MOBILE_REGEX.test(trimmed)) {
      toast.error('Please enter a valid 10-digit Vietnamese mobile number (e.g., 0901234567).');
      return;
    }

    setIsSending(true);
    try {
      await handleSendPhoneOtp(trimmed);
      setIsOtpSent(true);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not send SMS verification code.');
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleConfirmOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      toast.error('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      await handleVerifyPhone(otp);
      setIsEditingPhone(false);
      setIsOtpSent(false);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Invalid or expired OTP code.');
      } else {
        toast.error('Failed to verify OTP code.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Recruiter Workspace', href: ROUTES.RECRUITER_DASHBOARD },
          { label: 'Company Verification', href: ROUTES.RECRUITER_COMPANY_VERIFICATION },
          { label: 'Phone Verification' },
        ]}
      />

      {/* Main Verification Card */}
      <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Mobile Phone Authentication</h2>
          <p className="text-xs text-slate-500">
            A 6-digit OTP code will be sent via SMS to your Vietnamese mobile number to verify your recruiter identity.
          </p>
        </div>

        {/* Verification Status or Form */}
        {profile.phone.isVerified && !isEditingPhone ? (
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-950">
                    Verified phone number: <span className="font-mono text-base">{profile.phone.phoneNumber}</span>
                  </div>
                  <div className="text-xs text-emerald-700">
                    Your recruiter identity is secured. Reached Level 2 standard prerequisites.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingPhone(true)}
                className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                Change Phone Number
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl space-y-6">
            {/* Input + Send OTP Button */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number (e.g. 0901234567)"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending}
                className="shrink-0 rounded-xl bg-[#00b14f] px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-600 active:scale-95 disabled:opacity-60"
              >
                {isSending ? 'Sending...' : isOtpSent ? 'Resend Code' : 'Send Verification Code'}
              </button>
            </div>

            {/* OTP Section (Shown after clicking Send OTP) */}
            {isOtpSent && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Enter the 6-digit code sent to {phoneNumber}</span>
                  {countdown > 0 ? (
                    <span className="font-semibold text-emerald-700">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSending}
                      className="font-bold text-[#00b14f] hover:underline"
                    >
                      Resend code now
                    </button>
                  )}
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-900 shadow-2xs focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">Security code expires in 5 minutes.</span>
                  <button
                    type="button"
                    onClick={handleConfirmOtp}
                    disabled={isVerifying}
                    className="rounded-xl bg-[#035942] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#024a37] disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Confirm OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-800">Why verify your mobile number?</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#00b14f]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">Identity Security</div>
                <div className="text-[11px] leading-relaxed text-slate-500">
                  Protects your recruiter account against unauthorized access and account takeovers.
                </div>
              </div>
            </div>

            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">Unlock Level 2 Tier</div>
                <div className="text-[11px] leading-relaxed text-slate-500">
                  Enables unlimited job drafts, AI job description assistance, and candidate directory browsing.
                </div>
              </div>
            </div>

            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">Anti-Impersonation</div>
                <div className="text-[11px] leading-relaxed text-slate-500">
                  Guarantees that recruitment activities are tied to a verified human hiring representative.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
