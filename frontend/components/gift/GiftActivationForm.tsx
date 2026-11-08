'use client';

import React, { useState } from 'react';
import { CircleUser, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { GiftActivationResult } from '@/types/gift';

interface GiftActivationFormProps {
  packageType: string;
  setPackageType: (val: string) => void;
  couponCode: string;
  setCouponCode: (val: string) => void;
  onApplySuccess: (result: GiftActivationResult) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
}

export function GiftActivationForm({
  packageType,
  setPackageType,
  couponCode,
  setCouponCode,
  onApplySuccess,
  formRef,
}: GiftActivationFormProps) {
  const [agreePartner, setAgreePartner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<GiftActivationResult | null>(null);

  const getPackageNameById = (id: string) => {
    switch (id) {
      case '300':
        return 'Education VIP account (1 year)';
      case '400':
        return 'Pro VIP account (1 month)';
      case '402':
        return 'Premium VIP account (1 year)';
      default:
        return 'VIP account';
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('Please enter your gift (coupon) code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const isKnown = ['EDU-VIP-2026', 'PRO-TRIAL-30D', 'TOPCV-PREMIUM-VIP', 'GITIHO-EXCEL-FREE'].includes(trimmed);
      const isPromo = ['TOPCV', 'VIP', 'EDU', 'PRO', 'INTERVUE'].some((prefix) => trimmed.includes(prefix));

      if (isKnown || isPromo || trimmed.length >= 6) {
        const result: GiftActivationResult = {
          packageName: getPackageNameById(packageType),
          code: trimmed,
          expiryText: packageType === '400' ? '1 month from today' : '1 year (12 months) from today',
        };
        setSuccessInfo(result);
        onApplySuccess(result);
      } else {
        setErrorMsg('The code is invalid or has already been used. Please check it again!');
      }
    }, 800);
  };

  return (
    <div
      ref={formRef}
      className="border-outline-variant mx-auto w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm sm:p-9 md:p-10"
    >
      <div className="mb-6 text-left">
        <h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">Redeem a gift code</h1>
        <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
          Congratulations on receiving an InterVue gift code. Redeem it by choosing an account plan and entering the
          code to unlock great benefits!
        </p>
      </div>

      {errorMsg && (
        <div className="border-error/30 bg-error/10 text-error mb-5 flex items-start gap-3 rounded-xl border p-3.5 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button type="button" onClick={() => setErrorMsg('')} className="text-error hover:text-error">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successInfo && (
        <div className="border-primary/30 text-on-primary-container mb-6 rounded-2xl border bg-emerald-50/70 p-5">
          <div className="text-primary flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-5 w-5" />
            <span>Code redeemed!</span>
          </div>
          <p className="text-on-primary-container mt-1 text-sm">
            You have successfully unlocked <strong>{successInfo.packageName}</strong>. Valid for:{' '}
            {successInfo.expiryText}.
          </p>
        </div>
      )}

      <form onSubmit={handleApplyCoupon} className="space-y-4">
        <div>
          <label className="text-on-surface mb-1.5 block text-sm font-semibold">
            Choose the account plan to activate
          </label>
          <div className="relative">
            <span className="text-primary pointer-events-none absolute top-3 left-3.5 z-10 flex items-center">
              <CircleUser className="h-5 w-5" />
            </span>
            <select
              id="type-coupon"
              name="type"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="border-outline text-on-surface focus:border-primary h-11 w-full appearance-none rounded-xl border bg-white pr-10 pl-11 text-sm font-medium transition hover:border-slate-400 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
            >
              <option value="300">Education VIP account (1 year)</option>
              <option value="400">Pro VIP account (1 month)</option>
              <option value="402">Premium VIP account (1 year)</option>
            </select>
          </div>
        </div>

        <Input
          label="Gift code (coupon)"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="Enter your gift code"
        />

        <div className="pt-1">
          <label className="text-on-surface-variant flex cursor-pointer items-start gap-2.5 text-xs select-none">
            <input
              type="checkbox"
              checked={agreePartner}
              onChange={(e) => setAgreePartner(e.target.checked)}
              className="border-outline text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded"
            />
            <span>
              I agree to share my registration details to receive course gifts and exclusive offers from partners
              (Gitiho).
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={loading} className="w-full py-3 text-sm font-bold">
            Apply code now
          </Button>
        </div>
      </form>
    </div>
  );
}

export default GiftActivationForm;
