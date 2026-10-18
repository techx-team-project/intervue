import { ReactNode } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountBreadcrumbs from '@/components/account/AccountBreadcrumbs';
import RequireAuth from '@/components/auth/RequireAuth';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="text-navy flex min-h-screen flex-col bg-[#f4f5f5] antialiased">
      <Header />

      <AccountBreadcrumbs />

      <main className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <AccountSidebar />

            <div className="min-w-0 flex-1">
              <RequireAuth>{children}</RequireAuth>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
