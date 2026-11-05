'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { useAuthStore } from '@/store/auth.store';
import { CheckCircle2, Headphones, Phone, ShieldCheck, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatPhoneNumber, PhoneVerificationModal, VIETNAM_MOBILE_REGEX } from './PhoneVerificationModal';

export function PhoneVerificationView() {
  const { profile, refreshProfile } = useCompanyVerification();
  const user = useAuthStore((s) => s.user);

  // Derived state directly from live user / verification profile (no cascading useEffect)
  const serverPhone = profile.phone.phoneNumber || user?.phone || '';
  const isVerified = profile.phone.isVerified || Boolean(user?.phoneVerified);

  // User input state overrides serverPhone only when user manually types
  const [inputPhone, setInputPhone] = useState<string | null>(null);
  const phoneNumber = inputPhone !== null ? inputPhone : serverPhone;

  // Modal states: Initial verification vs. Change existing phone
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  // Click "Send verification code" -> validates input and opens Step-up confirmation modal
  const handleInitiateVerification = () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed || !VIETNAM_MOBILE_REGEX.test(trimmed)) {
      toast.error('Please enter a valid 10-digit Vietnamese mobile number (e.g. 0901234567).');
      return;
    }
    setIsInitialModalOpen(true);
  };

  const handleInitialSuccess = (verifiedPhone: string) => {
    setInputPhone(verifiedPhone);
    setIsInitialModalOpen(false);
    refreshProfile();
  };

  const handleChangeSuccess = (newVerifiedPhone: string) => {
    setInputPhone(newVerifiedPhone);
    setIsChangeModalOpen(false);
    refreshProfile();
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Recruiter Workspace', href: ROUTES.RECRUITER_DASHBOARD },
          { label: 'Company Verification', href: ROUTES.RECRUITER_COMPANY_VERIFICATION },
          { label: 'Phone Verification' },
        ]}
      />

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-2xs">
        <Image
          src="/images/recruiter/banner-phone-verify-final.jpg"
          alt="InterVue Employer Phone Verification"
          width={1200}
          height={330}
          priority
          unoptimized
          className="block h-auto w-full object-contain"
        />
      </div>

      {/* Main Verification Card */}
      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-800">Update and verify phone number</h2>
        </div>

        {/* Verification Status or Form */}
        {isVerified ? (
          <div className="space-y-3">
            {/* Input display & Change button row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Phone display field with subtle verified badge */}
              <div className="relative w-full sm:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={formatPhoneNumber(phoneNumber)}
                  className="h-11 w-full cursor-default rounded-md border border-slate-200 bg-slate-50/70 pr-28 pl-10 text-sm font-medium text-slate-800 select-all focus:outline-none"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="inline-flex items-center gap-1 rounded border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00b14f]" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Action Button: Change Phone Number */}
              <button
                type="button"
                onClick={() => setIsChangeModalOpen(true)}
                className="flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-98"
              >
                Change phone number
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This verified phone number is used for candidate contact and dedicated support from InterVue.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Input + Send OTP Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="relative w-full sm:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setInputPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInitiateVerification();
                    }
                  }}
                  placeholder="e.g. 0912345678"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleInitiateVerification}
                className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#00b14f] px-6 text-sm font-medium text-white shadow-2xs transition hover:bg-emerald-600 active:scale-98"
              >
                Send verification code
              </button>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-3.5 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-medium text-slate-700">Benefits of phone verification:</h3>

          <div className="grid grid-cols-1 gap-x-10 gap-y-3.5 md:grid-cols-2">
            {/* Benefit 1: Identity Security */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-[#00b14f]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="pt-0.5 text-xs leading-relaxed text-slate-600">
                Enhance recruiter account security, shield against fraudulent impersonation and unauthorized takeovers.
              </p>
            </div>

            {/* Benefit 2: Fast Support */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-[#00b14f]">
                <Headphones className="h-5 w-5" />
              </div>
              <p className="pt-0.5 text-xs leading-relaxed text-slate-600">
                Receive rapid dedicated support from the InterVue team via verified phone line for urgent hiring
                queries.
              </p>
            </div>

            {/* Benefit 3: Recruitment Credibility */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-[#00b14f]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="pt-0.5 text-xs leading-relaxed text-slate-600">
                Elevate employer branding trust, increase job listing visibility with relevant tech candidates, and
                boost application rates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Initial Phone Verification Modal (Initial Flow) */}
      <PhoneVerificationModal
        isOpen={isInitialModalOpen}
        onClose={() => setIsInitialModalOpen(false)}
        currentPhoneNumber={phoneNumber}
        mode="INITIAL"
        onSuccess={handleInitialSuccess}
        onChangePhoneNumber={() => setIsInitialModalOpen(false)}
      />

      {/* Change Verified Phone Modal (Change Flow) */}
      <PhoneVerificationModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentPhoneNumber={phoneNumber}
        mode="CHANGE"
        onSuccess={handleChangeSuccess}
      />
    </div>
  );
}
