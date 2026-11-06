'use client';

import Button from '@/components/ui/Button';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'intervue_cookie_consent_v1';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    // Strictly necessary admin operations are exempt from consumer cookie consent (GDPR Art. 5(3) & Decree 13)
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  if (!isVisible || isAdmin) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-3xl duration-300 sm:right-6 sm:bottom-6 sm:left-6">
      <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">Bảo vệ quyền riêng tư & Cookie</h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              InterVue sử dụng cookie bảo mật duy trì phiên làm việc và tuân thủ Nghị định 13/2023/NĐ-CP. Xem{' '}
              <Link href="/data-processing-agreement" className="font-semibold text-emerald-600 hover:underline">
                Thỏa thuận xử lý dữ liệu
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEssentialOnly}
            className="h-8 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600"
          >
            Chỉ cần thiết
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAcceptAll}
            className="h-8 rounded-lg bg-emerald-600 px-3 text-[11px] font-bold text-white hover:bg-emerald-500"
          >
            Đồng ý
          </Button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            aria-label="Đóng"
            className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
