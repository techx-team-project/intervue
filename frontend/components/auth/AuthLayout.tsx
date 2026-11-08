import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { SUPPORT_EMAIL } from '@/constants/header';
import { Check } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

const BENEFITS = [
  'Apply quickly with your saved CV',
  'AI CV feedback and interview practice',
  'Track the status of every application',
];

export function InterVueLogo() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="inline-flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/intervue-logo.png" alt="InterVue" className="h-11 w-auto max-w-55 object-contain sm:h-12" />
      </Link>
    </div>
  );
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen flex-col">
      <Header />

      <main className="grid flex-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="bg-primary-deeper relative hidden overflow-hidden p-14 lg:flex lg:flex-col lg:justify-center">
          <div aria-hidden className="bg-primary-deep absolute -right-32 -bottom-32 h-[480px] w-[480px] rounded-full" />
          <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.07]" />

          <div className="relative max-w-md">
            <p className="text-label-lg text-primary-bright flex items-center gap-3 font-bold tracking-widest uppercase">
              <span aria-hidden className="bg-primary-bright h-px w-10" />
              For candidates
            </p>
            <p className="font-display text-display-md mt-5 text-white">Your next IT job starts here</p>
            <ul className="mt-10 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="text-title-md flex items-center gap-3 font-normal text-white/85">
                  <span className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="bg-surface-container-low flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="bg-surface shadow-card w-full max-w-120 rounded-3xl p-7 sm:p-10">
            <header className="mb-6 text-center">
              <InterVueLogo />
              <h1 className="font-display text-headline-sm text-on-surface mt-4 font-bold">{title}</h1>
            </header>

            {children}

            <footer className="bg-surface-container-low text-body-sm text-on-surface-variant mt-6 rounded-2xl px-4 py-3 text-center leading-relaxed">
              Need help? Contact{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-semibold hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </footer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
