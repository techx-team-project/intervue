'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LeftChevronPattern from './LeftChevronPattern';

export type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthLayoutProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  children: ReactNode;
}

export function InterVueLogo() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="group inline-flex items-center transition-transform duration-200 hover:scale-[1.03]">
        <img
          src="/intervue-logo.png"
          alt="InterVue - Tiếp lợi thế, nối thành công"
          className="h-11 w-auto max-w-55 object-contain sm:h-12"
        />
      </Link>
    </div>
  );
}

export default function AuthLayout({ mode, children }: AuthLayoutProps) {
  const [showToast, setShowToast] = useState(true);

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Chào mừng quay trở lại';
      case 'register':
        return 'Chào mừng bạn đến với InterVue';
      case 'forgot-password':
        return 'Quên mật khẩu';
    }
  };

  return (
    <div className="text-navy flex min-h-screen flex-col bg-[#f4f6f8] antialiased">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Authentication Content with Clean Canvas & Halftone Accents */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f4f6f8] px-4 py-12 sm:py-16">
        {/* Left Halftone Dotted Chevron Decorative Pattern */}
        <LeftChevronPattern />

        {/* Subtle Ambient Radial Gradients & Micro-dot Matrix */}
        <div className="bg-primary/5 pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-50" />

        {/* Floating Toast Notification */}
        {showToast && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed top-20 right-5 z-40 flex items-center gap-2.5 rounded-lg border border-emerald-600/20 bg-[#2ea35b] px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl shadow-black/10 backdrop-blur-md transition-all"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Check className="h-3.5 w-3.5 stroke-3" />
            </div>
            <span>Lưu trạng thái cookie thành công</span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="ml-1 cursor-pointer rounded p-0.5 text-white/80 hover:bg-white/20 hover:text-white"
              aria-label="Đóng thông báo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </aside>
        )}

        {/* Main Floating Authentication Card */}
        <div className="relative z-10 w-full max-w-120 rounded-3xl border border-[#edf0f2] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
          {/* Top Logo & Title */}
          <header className="mb-6 text-center">
            <InterVueLogo />
            <h1 className="text-navy mt-3 text-[16px] font-bold">{getTitle()}</h1>
          </header>

          {/* Form Slot (Login / Register / Forgot Password) */}
          {children}

          {/* Bottom Help Desk Box */}
          <footer className="mt-6 rounded-xl border border-[#f1f5f9] bg-[#f8fafc] px-4 py-2.5 text-center text-[12px] leading-relaxed text-[#64748b]">
            Bạn gặp khó khăn khi tạo tài khoản? Vui lòng gọi tới số{' '}
            <span className="text-primary font-bold">1900 068 889</span> |{' '}
            <span className="text-primary font-bold">Nhánh 2</span> (giờ hành chính).
          </footer>
        </div>
      </main>

      {/* 3. Global Comprehensive Footer */}
      <Footer />
    </div>
  );
}
