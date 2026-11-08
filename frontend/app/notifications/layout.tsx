import RequireAuth from '@/components/auth/RequireAuth';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ReactNode } from 'react';

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="text-navy bg-surface-container-low flex min-h-screen flex-col antialiased">
      <Header />

      <main className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RequireAuth>{children}</RequireAuth>
        </div>
      </main>

      <Footer />
    </div>
  );
}
