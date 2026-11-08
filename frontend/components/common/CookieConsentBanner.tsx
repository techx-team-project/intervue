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
      <div className="border-outline-variant/90 shadow-elevation-2 flex flex-col gap-3.5 rounded-2xl border bg-white/95 p-4 shadow-slate-900/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5">
        <div className="flex items-start gap-3">
          <div className="bg-primary-light text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-on-surface text-xs font-bold">Privacy & Cookies</h4>
            <p className="text-label-sm text-on-surface-variant leading-relaxed">
              InterVue uses security cookies to keep your session and complies with Decree 13/2023/ND-CP. See the{' '}
              <Link href="/data-processing-agreement" className="text-primary font-semibold hover:underline">
                data processing agreement
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
            className="text-label-sm text-on-surface-variant h-8 rounded-lg px-2.5 font-semibold"
          >
            Essential only
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAcceptAll}
            className="bg-primary text-label-sm hover:bg-primary h-8 rounded-lg px-3 font-bold text-white"
          >
            Accept
          </Button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            aria-label="Close"
            className="text-outline hover:text-on-surface-variant cursor-pointer p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
