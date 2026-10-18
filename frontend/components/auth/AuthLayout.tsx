'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LeftChevronPattern from './LeftChevronPattern';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export function InterVueLogo() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="group inline-flex items-center transition-transform duration-200 hover:scale-[1.03]">
        <img
          src="/intervue-logo.png"
          alt="InterVue - Empower your career"
          className="h-11 w-auto max-w-55 object-contain sm:h-12"
        />
      </Link>
    </div>
  );
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="text-navy flex min-h-screen flex-col bg-[#f4f6f8] antialiased">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f4f6f8] px-4 py-12 sm:py-16">
        <LeftChevronPattern />

        <div className="bg-primary/5 pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-50" />

        {showToast && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed top-20 right-5 z-40 flex items-center gap-2.5 rounded-lg border border-emerald-600/20 bg-[#2ea35b] px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl shadow-black/10 backdrop-blur-md transition"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Check className="h-3.5 w-3.5 stroke-3" />
            </div>
            <span>Cookie preferences saved</span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="ml-1 cursor-pointer rounded p-0.5 text-white/80 hover:bg-white/20 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </aside>
        )}

        <div className="relative z-10 w-full max-w-120 rounded-3xl border border-[#edf0f2] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
          <header className="mb-6 text-center">
            <InterVueLogo />
            <h1 className="text-navy mt-3 text-[16px] font-bold">{title}</h1>
          </header>

          {children}

          <footer className="mt-6 rounded-xl border border-[#f1f5f9] bg-[#f8fafc] px-4 py-2.5 text-center text-[12px] leading-relaxed text-[#64748b]">
            Having trouble creating an account? Please call <span className="text-primary font-bold">1900 068 889</span>{' '}
            | <span className="text-primary font-bold">Ext. 2</span> (business hours).
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
}
