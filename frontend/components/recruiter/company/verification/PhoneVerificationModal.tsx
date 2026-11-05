'use client';

import { phoneVerificationApi } from '@/apiRequest/phone-verification';
import { isApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';
import { ArrowLeft, CheckCircle2, Headphones, Mail, Phone, ShieldCheck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const VIETNAM_MOBILE_REGEX = /^0[35789]\d{8}$/;

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoneNumber: string;
  mode?: 'INITIAL' | 'CHANGE';
  onSuccess: (verifiedPhone: string) => void;
  onChangePhoneNumber?: () => void;
}

function PhoneVerificationModalDialog({
  onClose,
  currentPhoneNumber,
  mode = 'INITIAL',
  onSuccess,
  onChangePhoneNumber,
}: Omit<PhoneVerificationModalProps, 'isOpen'>) {
  // In INITIAL mode we arrive having already requested OTP on the page
  const [step, setStep] = useState<'INPUT' | 'OTP'>(mode === 'CHANGE' ? 'INPUT' : 'OTP');

  // Form Inputs for CHANGE mode
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmittingInput, setIsSubmittingInput] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Target phone receiving the SMS
  const targetPhone = mode === 'CHANGE' ? newPhoneNumber : currentPhoneNumber;

  const newPhoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus on step change
  useEffect(() => {
    if (step === 'INPUT') {
      setTimeout(() => newPhoneInputRef.current?.focus(), 80);
    } else {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 80);
    }
  }, [step]);

  // Timer countdown for OTP
  useEffect(() => {
    if (step !== 'OTP' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Submit Step 1 (CHANGE mode): Validate new phone & Send SMS
  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhoneNumber.trim();

    if (!cleanPhone) {
      setPhoneError('Please enter a new mobile phone number.');
      return;
    }
    if (!VIETNAM_MOBILE_REGEX.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Vietnamese mobile number (e.g. 0901234567).');
      return;
    }
    if (cleanPhone === currentPhoneNumber.replace(/\D/g, '')) {
      setPhoneError('New phone number must be different from your current phone.');
      return;
    }

    setPhoneError(null);
    setIsSubmittingInput(true);
    try {
      await phoneVerificationApi.sendOtp(cleanPhone);
      setStep('OTP');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      toast.success(`Verification code sent to ${cleanPhone}!`);
    } catch (err) {
      if (isApiError(err)) {
        setPhoneError(err.message || 'Could not send verification code.');
      } else {
        setPhoneError('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSubmittingInput(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await phoneVerificationApi.sendOtp(targetPhone);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      otpInputRefs.current[0]?.focus();
      toast.success(`New verification code sent to ${targetPhone}!`);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not resend code.');
      } else {
        toast.error('Failed to resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (otpError) setOtpError(null);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').trim();
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length === 6) {
      const digits = digitsOnly.split('');
      setOtpDigits(digits);
      if (otpError) setOtpError(null);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Submit Step 2: Confirm OTP with backend
  const handleOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const updatedUser = await phoneVerificationApi.verifyOtp(code);
      const store = useAuthStore.getState();
      if (store.accessToken && updatedUser) {
        store.setSession({ accessToken: store.accessToken, user: updatedUser });
      }
      toast.success(
        mode === 'CHANGE'
          ? 'Mobile phone number updated and verified successfully!'
          : 'Mobile phone number verified successfully!',
      );
      onSuccess(targetPhone);
      onClose();
    } catch (err) {
      if (isApiError(err)) {
        setOtpError(err.message || 'Invalid verification code. Please check and try again.');
      } else {
        setOtpError('Failed to verify code. Please try again.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-150 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ================= STEP 1: NEW PHONE (CHANGE MODE) ================= */}
        {step === 'INPUT' && (
          <div className="space-y-5">
            {/* Header Title */}
            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-semibold text-[#00b14f] sm:text-lg">Change verified phone number</h3>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                Enter your new mobile phone number. We will send an SMS verification code to confirm ownership.
              </p>
            </div>

            {/* Current phone info box */}
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs">
              <span className="text-slate-600">Current verified phone:</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00b14f]" />
                {formatPhoneNumber(currentPhoneNumber)}
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleInputSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700">New Mobile Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    ref={newPhoneInputRef}
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => {
                      setNewPhoneNumber(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    placeholder="e.g. 0912345678"
                    className={`h-11 w-full rounded-md border bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:outline-none ${
                      phoneError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-300 focus:border-[#00b14f] focus:ring-emerald-200'
                    }`}
                  />
                </div>
                {phoneError && <p className="pt-0.5 text-xs font-medium text-red-600">{phoneError}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmittingInput}
                  className="h-10 w-28 cursor-pointer rounded-md bg-slate-100 text-xs font-medium text-slate-700 transition hover:bg-slate-200 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInput}
                  className="flex h-10 min-w-32 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#00b14f] px-5 text-xs font-medium text-white shadow-xs transition hover:bg-emerald-600 disabled:opacity-60 sm:text-sm"
                >
                  {isSubmittingInput ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    'Send verification code'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: ENTER OTP CODE ================= */}
        {step === 'OTP' && (
          <div className="animate-in fade-in space-y-6 duration-150">
            {/* Header Title */}
            <div className="space-y-2 text-center">
              <h3 className="text-base font-semibold text-[#00b14f] sm:text-lg">
                {mode === 'CHANGE' ? 'Verify new phone number' : 'Enter verification code'}
              </h3>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                A 6-digit verification code has been sent via SMS to{' '}
                <strong className="text-slate-900">{formatPhoneNumber(targetPhone)}</strong>
                {mode === 'INITIAL' && onChangePhoneNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onChangePhoneNumber();
                    }}
                    className="ml-2 cursor-pointer font-medium text-[#00b14f] hover:underline"
                  >
                    (Change)
                  </button>
                )}
              </p>
              {/* Development note for local environment */}
              <div className="inline-block rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-800">
                💡 Local Dev Tip: In local mode, OTP is logged in your Spring Boot console (
                <code className="font-mono text-emerald-900">[LOCAL SMS - not delivered]</code>).
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2 pt-1 sm:gap-2.5" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="h-12 w-11 rounded-md border border-slate-300 bg-white text-center font-mono text-lg font-bold text-slate-900 shadow-2xs transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:h-12 sm:w-12"
                  />
                ))}
              </div>

              {/* Inline OTP Error */}
              {otpError && <p className="text-center text-xs font-semibold text-red-600">{otpError}</p>}

              {/* Resend & Expiry Info */}
              <div className="flex flex-col items-center justify-center gap-1 pt-1 text-xs text-slate-500">
                <div>
                  Didn&apos;t receive the code?{' '}
                  {countdown > 0 ? (
                    <span className="font-semibold text-emerald-700">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="cursor-pointer font-semibold text-[#00b14f] hover:underline disabled:opacity-50"
                    >
                      {isResending ? 'Sending...' : 'Resend code now'}
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">Code expires in 5 minutes</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'CHANGE') {
                      setStep('INPUT');
                    } else {
                      onClose();
                    }
                  }}
                  disabled={isVerifyingOtp}
                  className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md bg-slate-100 px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-200 sm:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
                  className="flex h-10 min-w-36 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#00b14f] px-5 text-xs font-medium text-white shadow-xs transition hover:bg-emerald-600 disabled:opacity-50 sm:text-sm"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{mode === 'CHANGE' ? 'Confirm & Update' : 'Confirm OTP'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact Support Hotline / Email Box */}
        <div className="mt-7 rounded-lg border border-slate-100 bg-slate-50/80 p-3.5 text-left sm:p-4">
          <p className="text-xs font-semibold text-slate-600">
            For any inquiries or assistance, please contact our official support desk:
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-1.5">
              <Headphones className="h-4 w-4 text-[#00b14f]" />
              <span>
                Customer Hotline: <strong className="text-slate-900">1900 068 889 (Ext. 1)</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-[#00b14f]" />
              <span>
                Email:{' '}
                <a href="mailto:support@intervue.vn" className="font-medium text-[#00b14f] hover:underline">
                  support@intervue.vn
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  currentPhoneNumber,
  mode = 'INITIAL',
  onSuccess,
  onChangePhoneNumber,
}: PhoneVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <PhoneVerificationModalDialog
      onClose={onClose}
      currentPhoneNumber={currentPhoneNumber}
      mode={mode}
      onSuccess={onSuccess}
      onChangePhoneNumber={onChangePhoneNumber}
    />
  );
}
