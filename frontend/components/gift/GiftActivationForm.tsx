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
        return 'Tài khoản Education VIP (1 năm)';
      case '400':
        return 'Tài khoản Pro VIP (1 tháng)';
      case '402':
        return 'Tài khoản Premium VIP (1 năm)';
      default:
        return 'Tài khoản VIP';
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập mã quà tặng (coupon code) của bạn.');
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
          expiryText: packageType === '400' ? '1 tháng kể từ hôm nay' : '1 năm (12 tháng) kể từ hôm nay',
        };
        setSuccessInfo(result);
        onApplySuccess(result);
      } else {
        setErrorMsg('Mã code không hợp lệ hoặc đã được sử dụng. Vui lòng kiểm tra lại!');
      }
    }, 800);
  };

  return (
    <div
      ref={formRef}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9 md:p-10"
    >
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl">Kích hoạt mã quà tặng</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Chúc mừng bạn đã nhận được mã quà tặng InterVue. Kích hoạt ngay bằng cách chọn gói tài khoản và nhập mã code
          để nhận được những đặc quyền hấp dẫn!
        </p>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button type="button" onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success Notification Box */}
      {successInfo && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <span>Kích hoạt mã thành công!</span>
          </div>
          <p className="mt-1 text-sm text-emerald-800">
            Bạn đã mở khóa thành công <strong>{successInfo.packageName}</strong>. Thời hạn sử dụng:{' '}
            {successInfo.expiryText}.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleApplyCoupon} className="space-y-4">
        {/* Package Type Selector */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">Chọn gói tài khoản kích hoạt</label>
          <div className="relative">
            <span className="pointer-events-none absolute top-3 left-3.5 z-10 flex items-center text-emerald-600">
              <CircleUser className="h-5 w-5" />
            </span>
            <select
              id="type-coupon"
              name="type"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white pr-10 pl-11 text-sm font-medium text-slate-800 transition-all hover:border-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
            >
              <option value="300">Tài khoản Education VIP (1 năm)</option>
              <option value="400">Tài khoản Pro VIP (1 tháng)</option>
              <option value="402">Tài khoản Premium VIP (1 năm)</option>
            </select>
          </div>
        </div>

        {/* Coupon Code Input */}
        <Input
          label="Mã quà tặng (Coupon Code)"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="Nhập mã code quà tặng của bạn"
        />

        {/* Partner Checkbox */}
        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={agreePartner}
              onChange={(e) => setAgreePartner(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              Tôi đồng ý chia sẻ thông tin đăng ký để nhận quà tặng khoá học và ưu đãi độc quyền từ đối tác liên kết
              (Gitiho).
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button type="submit" isLoading={loading} className="w-full py-3 text-sm font-bold">
            Áp dụng mã ngay
          </Button>
        </div>
      </form>
    </div>
  );
}

export default GiftActivationForm;
