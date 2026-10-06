import { ReactNode } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountBreadcrumbs from '@/components/account/AccountBreadcrumbs';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5] text-[#263a4d] antialiased">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Breadcrumb Navigation Bar (Dynamic per route) */}
      <AccountBreadcrumbs />

      {/* 3. Main Workspace with Sidebar & Content Panel */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Left Navigation Sidebar */}
            <AccountSidebar />

            {/* Right Main Form Content */}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>

      {/* 4. Global Comprehensive Footer */}
      <Footer />
    </div>
  );
}
