'use client';

import Button from '@/components/ui/Button';
import { hasMobileActionBar } from '@/constants/ai-chat';
import { cn } from '@/lib/utils';
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
    <div
      className={cn(
        'animate-fade-in-up fixed right-4 left-4 z-50 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[26rem]',
        hasMobileActionBar(pathname) ? 'bottom-20' : 'bottom-4',
      )}
    >
      <div className="border-outline-variant bg-surface shadow-float flex flex-col gap-4 rounded-2xl border p-5">
        <div className="flex items-start gap-3">
          <div className="bg-primary-light text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-display text-title-sm text-on-surface font-bold">Privacy & Cookies</h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              InterVue uses security cookies to keep your session and complies with Decree 13/2023/ND-CP. See the{' '}
              <Link href="/data-processing-agreement" className="text-primary font-semibold hover:underline">
                data processing agreement
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEssentialOnly}
            className="flex-1 font-semibold"
          >
            Essential only
          </Button>
          <Button type="button" size="sm" onClick={handleAcceptAll} className="flex-1 font-semibold">
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
