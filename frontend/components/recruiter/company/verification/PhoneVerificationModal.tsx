'use client';

import { accountSecurityApiFor } from '@/apiRequest/account-security';
import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import { isApiError } from '@/lib/api-error';
import { isRecruiterPortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
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
  // Step state: 'INPUT' (Confirm Password & optional New Phone) -> 'OTP'
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');

  // Form Inputs
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors & Loading
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmittingInput, setIsSubmittingInput] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLocked, setIsOtpLocked] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Target phone receiving the SMS
  const targetPhone = mode === 'CHANGE' ? newPhoneNumber : currentPhoneNumber;

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const newPhoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus on step change
  useEffect(() => {
    if (step === 'INPUT') {
      if (mode === 'CHANGE') {
        setTimeout(() => newPhoneInputRef.current?.focus(), 80);
      } else {
        setTimeout(() => passwordInputRef.current?.focus(), 80);
      }
    } else if (!isOtpLocked) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 80);
    }
  }, [step, mode, isOtpLocked]);

  // Timer countdown for OTP
  useEffect(() => {
    if (step !== 'OTP' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Submit Step 1: Validate Password (& New Phone if CHANGE) -> Authenticate -> Send SMS OTP
  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Validate new phone in CHANGE mode
    if (mode === 'CHANGE') {
      const cleanPhone = newPhoneNumber.trim();
      if (!cleanPhone) {
        setPhoneError('Please enter a new mobile phone number.');
        hasError = true;
      } else if (!VIETNAM_MOBILE_REGEX.test(cleanPhone)) {
        setPhoneError('Please enter a valid 10-digit Vietnamese mobile number (e.g. 0901234567).');
        hasError = true;
      } else if (cleanPhone === currentPhoneNumber.replace(/\D/g, '')) {
        setPhoneError('New phone number must be different from your current phone.');
        hasError = true;
      } else {
        setPhoneError(null);
      }
    }

    // Validate password input
    const trimmedPw = password.trim();
    if (!trimmedPw) {
      setPasswordError('Please enter your account password.');
      hasError = true;
    } else if (trimmedPw.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    setIsSubmittingInput(true);

    // 1. Step-up password verification against backend
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.email) {
      try {
        const session = isRecruiterPortal()
          ? await recruiterAuthApi.login({ email: currentUser.email, password: trimmedPw })
          : await authApi.login({ email: currentUser.email, password: trimmedPw });
        if (session) {
          useAuthStore.getState().setSession(session);
        }
      } catch (err) {
        if (isApiError(err)) {
          setPasswordError(err.message || 'Incorrect account password. Please try again.');
        } else {
          setPasswordError('Failed to verify account password. Please try again.');
        }
        setIsSubmittingInput(false);
        return;
      }
    }

    // 2. Dispatch live SMS verification code to backend
    const api = accountSecurityApiFor(isRecruiterPortal() ? 'recruiter' : 'candidate');
    try {
      await api.sendPhoneOtp(targetPhone);
      setStep('OTP');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setIsOtpLocked(false);
      toast.success(`Verification code sent to ${targetPhone}!`);
    } catch (err) {
      if (isApiError(err)) {
        if (mode === 'CHANGE') {
          setPhoneError(err.message);
        } else {
          setPasswordError(err.message);
        }
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSubmittingInput(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    const api = accountSecurityApiFor(isRecruiterPortal() ? 'recruiter' : 'candidate');
    try {
      await api.sendPhoneOtp(targetPhone);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setIsOtpLocked(false);
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
    if (isOtpLocked || !/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (otpError) setOtpError(null);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      triggerVerifyOtp(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isOtpLocked) return;
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
    if (isOtpLocked) return;
    const raw = e.clipboardData.getData('text').trim();
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length === 6) {
      const digits = digitsOnly.split('');
      setOtpDigits(digits);
      if (otpError) setOtpError(null);
      otpInputRefs.current[5]?.focus();
      triggerVerifyOtp(digitsOnly);
    }
  };

  // Submit Step 2: Confirm OTP with backend
  const triggerVerifyOtp = async (codeToVerify?: string) => {
    if (isOtpLocked || isVerifyingOtp) return;
    const code = codeToVerify ?? otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    const api = accountSecurityApiFor(isRecruiterPortal() ? 'recruiter' : 'candidate');
    const minDelay = new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const patch = await api.verifyPhoneOtp(code);
      await minDelay;

      const store = useAuthStore.getState();
      if (store.accessToken && store.user) {
        store.setSession({
          accessToken: store.accessToken,
          user: { ...store.user, ...patch, phone: targetPhone, phoneVerified: true },
        });
      }
      toast.success(
        mode === 'CHANGE'
          ? 'Mobile phone number updated and verified successfully!'
          : 'Mobile phone number verified successfully!',
      );
      onSuccess(targetPhone);
      onClose();
    } catch (err) {
      await minDelay;

      // Clear all 6 digits so the user starts fresh
      setOtpDigits(['', '', '', '', '', '']);
      if (isApiError(err)) {
        if (err.code === 'PHONE_OTP_ATTEMPTS_EXCEEDED' || err.code === 'PHONE_OTP_NOT_REQUESTED') {
          setIsOtpLocked(true);
          setOtpError(
            err.code === 'PHONE_OTP_ATTEMPTS_EXCEEDED'
              ? 'You have exceeded the maximum verification attempts (3/3). This code has been invalidated. Please request a new code below.'
              : err.message || 'Verification session expired. Please request a new code.',
          );
        } else {
          setOtpError(err.message || 'Invalid verification code. Please check and try again.');
          setTimeout(() => otpInputRefs.current[0]?.focus(), 10);
        }
      } else {
        setOtpError('Failed to verify code. Please try again.');
        setTimeout(() => otpInputRefs.current[0]?.focus(), 10);
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerVerifyOtp();
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

        {/* ================= STEP 1: PASSWORD CONFIRMATION (AND NEW PHONE IF CHANGE MODE) ================= */}
        {step === 'INPUT' && (
          <div className="space-y-5">
            {/* Header Title */}
            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-semibold text-[#00b14f] sm:text-lg">
                {mode === 'CHANGE' ? 'Change verified phone number' : 'Please confirm this action'}
              </h3>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                {mode === 'CHANGE' ? (
                  'To protect your recruiter account, please confirm your password and enter your new phone number.'
                ) : (
                  <>
                    To ensure your recruiter account security and verify{' '}
                    <strong className="text-slate-900">{formatPhoneNumber(currentPhoneNumber)}</strong>, please enter
                    your password to proceed.
                  </>
                )}
              </p>
            </div>

            {/* In CHANGE mode: Show current phone info box */}
            {mode === 'CHANGE' && (
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs">
                <span className="text-slate-600">Current verified phone:</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#00b14f]" />
                  {formatPhoneNumber(currentPhoneNumber)}
                </span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleInputSubmit} className="space-y-4">
              {/* Field: New Phone Number (Only in CHANGE mode) */}
              {mode === 'CHANGE' && (
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
              )}

              {/* Field: Account Password */}
              <div className="space-y-1.5 text-left">
                {mode === 'CHANGE' && <label className="text-xs font-semibold text-slate-700">Account Password</label>}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter your account password"
                    className={`h-11 w-full rounded-md border bg-white py-2.5 pr-11 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:outline-none ${
                      passwordError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-300 focus:border-[#00b14f] focus:ring-emerald-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="pt-0.5 text-xs font-medium text-red-600">{passwordError}</p>}
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
                      <span>Verifying...</span>
                    </>
                  ) : mode === 'CHANGE' ? (
                    'Send code to new phone'
                  ) : (
                    'Confirm'
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
                    disabled={isVerifyingOtp || isOtpLocked}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className={`h-12 w-11 rounded-md border text-center font-mono text-lg font-bold shadow-2xs transition sm:h-12 sm:w-12 ${
                      isOtpLocked
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                        : isVerifyingOtp
                          ? 'border-emerald-400 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-200'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none'
                    }`}
                  />
                ))}
              </div>

              {/* Inline OTP Error */}
              {otpError && (
                <div
                  className={`flex items-start gap-1.5 rounded-md px-3 py-2 text-xs font-semibold ${
                    isOtpLocked
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : 'justify-center text-center text-red-600'
                  }`}
                >
                  {isOtpLocked && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />}
                  <span>{otpError}</span>
                </div>
              )}

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
                    setStep('INPUT');
                    setIsOtpLocked(false);
                    setOtpError(null);
                  }}
                  disabled={isVerifyingOtp}
                  className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md bg-slate-100 px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-200 sm:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp || isOtpLocked || otpDigits.join('').length !== 6}
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
