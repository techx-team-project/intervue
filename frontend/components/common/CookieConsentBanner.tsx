'use client';

import Button from '@/components/ui/Button';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'intervue_cookie_consent_v1';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-4xl duration-300 sm:right-6 sm:bottom-6 sm:left-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">Bảo vệ quyền riêng tư & Cookie</h4>
            <p className="text-xs leading-relaxed text-slate-600">
              InterVue sử dụng cookie bảo mật nhằm duy trì phiên đăng nhập và tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ
              dữ liệu cá nhân. Xem thêm{' '}
              <Link href="/data-processing-agreement" className="font-semibold text-emerald-600 hover:underline">
                Thỏa thuận xử lý dữ liệu cá nhân
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEssentialOnly}
            className="text-xs font-semibold"
          >
            Chỉ cookie cần thiết
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAcceptAll}
            className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
          >
            Đồng ý tất cả
          </Button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            aria-label="Đóng thông báo"
            className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
