'use client';

import type { ApplicationStatus, RecruiterApplication } from '@/types/recruiter-application';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import ApplicationDetailContent from './ApplicationDetailContent';

interface ApplicationDetailModalProps {
  application: RecruiterApplication | null;
  onClose: () => void;
  onRequestStatusChange: (application: RecruiterApplication, status: ApplicationStatus) => void;
  onToggleSaved: (id: string) => void;
  onAddNote: (id: string, content: string) => void;
  onReport: (application: RecruiterApplication) => void;
}

export default function ApplicationDetailModal({
  application,
  onClose,
  onRequestStatusChange,
  onToggleSaved,
  onAddNote,
  onReport,
}: ApplicationDetailModalProps) {
  useEffect(() => {
    if (!application) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [application, onClose]);

  if (!application) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết hồ sơ ứng tuyển"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/60" />

      <div className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết hồ sơ"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <ApplicationDetailContent
          key={application.id}
          application={application}
          onRequestStatusChange={(status) => onRequestStatusChange(application, status)}
          onToggleSaved={() => onToggleSaved(application.id)}
          onAddNote={(content) => onAddNote(application.id, content)}
          onReport={() => onReport(application)}
        />
      </div>
    </div>
  );
}
