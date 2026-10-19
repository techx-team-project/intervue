'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import {
  AlertCircle,
  Copy,
  Eye,
  MoreVertical,
  Pause,
  Pencil,
  PlayCircle,
  RotateCcw,
  SendHorizontal,
  Square,
  TimerReset,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface JobPostRowActionsMenuProps {
  job: RecruiterJobPost;
  isPending: boolean;
  onPause: () => void;
  onReopen: () => void;
  onClose: () => void;
  onExtend: () => void;
  onSubmitForReview: () => void;
  onRepost: () => void;
  onDuplicate: () => void;
  onPreview: () => void;
  onViewRejectionReason: () => void;
}

interface MenuAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  tone?: 'default' | 'danger';
}

const EDITABLE_STATUSES = new Set(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'PAUSED', 'REJECTED']);

export default function JobPostRowActionsMenu({
  job,
  isPending,
  onPause,
  onReopen,
  onClose,
  onExtend,
  onSubmitForReview,
  onRepost,
  onDuplicate,
  onPreview,
  onViewRejectionReason,
}: JobPostRowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions: MenuAction[] = [];

  if (EDITABLE_STATUSES.has(job.status)) {
    actions.push({ key: 'edit', label: 'Chỉnh sửa', icon: Pencil, href: `${ROUTES.RECRUITER_JOBS}/${job.id}/edit` });
  }

  actions.push({ key: 'preview', label: 'Xem trước', icon: Eye, onClick: onPreview });

  if (job.status !== 'DRAFT') {
    actions.push({
      key: 'applications',
      label: 'Hồ sơ ứng tuyển',
      icon: Users,
      href: `${ROUTES.RECRUITER_APPLICATIONS_COMMAND_CENTER}?job=${job.id}`,
    });
  }

  if (job.status === 'DRAFT' || job.status === 'REJECTED') {
    actions.push({ key: 'submit', label: 'Gửi duyệt', icon: SendHorizontal, onClick: onSubmitForReview });
  }

  if (job.status === 'PUBLISHED') {
    actions.push({ key: 'pause', label: 'Tạm dừng', icon: Pause, onClick: onPause });
    actions.push({ key: 'extend', label: 'Gia hạn', icon: TimerReset, onClick: onExtend });
  }

  if (job.status === 'PAUSED') {
    actions.push({ key: 'reopen', label: 'Mở lại', icon: PlayCircle, onClick: onReopen });
  }

  if (job.status === 'PUBLISHED' || job.status === 'PAUSED') {
    actions.push({ key: 'close', label: 'Đóng tin', icon: Square, onClick: onClose, tone: 'danger' });
  }

  if (job.status === 'EXPIRED') {
    actions.push({ key: 'repost', label: 'Đăng lại', icon: RotateCcw, onClick: onRepost });
  }

  if (job.status === 'REJECTED') {
    actions.push({ key: 'reason', label: 'Xem lý do từ chối', icon: AlertCircle, onClick: onViewRejectionReason });
  }

  actions.push({ key: 'duplicate', label: 'Nhân bản', icon: Copy, onClick: onDuplicate });

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Thao tác"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-9 right-0 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
          {actions.map((action) => {
            const Icon = action.icon;
            const className = `flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors hover:bg-slate-50 ${
              action.tone === 'danger' ? 'text-rose-600' : 'text-slate-700'
            }`;

            if (action.href) {
              return (
                <Link key={action.key} href={action.href} className={className} onClick={() => setIsOpen(false)}>
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={action.key}
                type="button"
                className={className}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
