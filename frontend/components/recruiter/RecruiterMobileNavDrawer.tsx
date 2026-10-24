'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import RecruiterSidebar from './RecruiterSidebar';

interface RecruiterMobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecruiterMobileNavDrawer({ isOpen, onClose }: RecruiterMobileNavDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Recruiter menu" className="fixed inset-0 z-50 lg:hidden">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/50" />

      <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-xs flex-col bg-white shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#eef1f5] px-4">
          <span className="text-navy text-[13px] font-bold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <RecruiterSidebar isCollapsed={false} onNavigate={onClose} className="min-h-0 flex-1 overflow-y-auto" />
      </div>
    </div>
  );
}
