'use client';

import type { AdminPermission, AdminQueueCounts } from '@/types/admin';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminMobileNavDrawerProps {
  onClose: () => void;
  queueCounts: AdminQueueCounts;
  twoFactorEnabled: boolean;
  adminName?: string;
  adminEmail?: string;
  permissions?: AdminPermission[];
}

export default function AdminMobileNavDrawer({
  onClose,
  queueCounts,
  twoFactorEnabled,
  adminName,
  adminEmail,
  permissions,
}: AdminMobileNavDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Admin menu" className="fixed inset-0 z-50 lg:hidden">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/50" />

      <div className="dark:bg-forest-900 absolute inset-y-0 left-0 flex w-[88%] max-w-xs flex-col bg-white shadow-2xl">
        <div className="dark:border-forest-800 flex h-14 shrink-0 items-center justify-between border-b border-[#eef1f5] px-4">
          <span className="text-navy dark:text-forest-50 text-[13px] font-bold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the menu"
            className="dark:hover:bg-forest-850 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <AdminSidebar
          isCollapsed={false}
          queueCounts={queueCounts}
          twoFactorEnabled={twoFactorEnabled}
          adminName={adminName}
          adminEmail={adminEmail}
          permissions={permissions}
          onNavigate={onClose}
          className="min-h-0 w-full flex-1 overflow-y-auto"
        />
      </div>
    </div>
  );
}
