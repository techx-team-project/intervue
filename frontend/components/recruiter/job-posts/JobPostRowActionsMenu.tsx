'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import {
  AlertCircle,
  Copy,
  Eye,
  Link2,
  MoreVertical,
  Pause,
  Pencil,
  PlayCircle,
  RotateCcw,
  SendHorizontal,
  Square,
  TimerReset,
  Trash2,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  onCopyLink?: () => void;
  onDelete?: () => void;
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

const MENU_WIDTH = 208;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;
const ITEM_HEIGHT = 36;

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
  onCopyLink,
  onDelete,
}: JobPostRowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = () => setIsOpen(false);
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, [isOpen]);

  const actions: MenuAction[] = [];

  if (EDITABLE_STATUSES.has(job.status)) {
    actions.push({ key: 'edit', label: 'Edit post', icon: Pencil, href: `${ROUTES.RECRUITER_JOBS}/${job.id}/edit` });
  }

  actions.push({ key: 'preview', label: 'Preview candidate view', icon: Eye, onClick: onPreview });

  if (onCopyLink && (job.status === 'PUBLISHED' || job.status === 'PAUSED')) {
    actions.push({ key: 'copy-link', label: 'Copy public link', icon: Link2, onClick: onCopyLink });
  }

  if (job.status !== 'DRAFT') {
    actions.push({
      key: 'applications',
      label: `Applications (${job.applicantsCount || 0})`,
      icon: Users,
      href: `${ROUTES.RECRUITER_APPLICATIONS}?job=${job.id}`,
    });
  }

  if (job.status === 'DRAFT' || job.status === 'REJECTED') {
    actions.push({ key: 'submit', label: 'Submit for review', icon: SendHorizontal, onClick: onSubmitForReview });
  }

  if (job.status === 'PUBLISHED') {
    actions.push({ key: 'pause', label: 'Pause post', icon: Pause, onClick: onPause });
    actions.push({ key: 'extend', label: 'Extend 30 days', icon: TimerReset, onClick: onExtend });
  }

  if (job.status === 'PAUSED') {
    actions.push({ key: 'reopen', label: 'Reopen post', icon: PlayCircle, onClick: onReopen });
  }

  if (job.status === 'PUBLISHED' || job.status === 'PAUSED') {
    actions.push({ key: 'close', label: 'Close post', icon: Square, onClick: onClose, tone: 'danger' });
  }

  if (job.status === 'EXPIRED') {
    actions.push({ key: 'repost', label: 'Repost job', icon: RotateCcw, onClick: onRepost });
  }

  if (job.status === 'REJECTED') {
    actions.push({ key: 'reason', label: 'View rejection reason', icon: AlertCircle, onClick: onViewRejectionReason });
  }

  actions.push({ key: 'duplicate', label: 'Duplicate as draft', icon: Copy, onClick: onDuplicate });

  if (onDelete && (job.status === 'DRAFT' || job.status === 'CLOSED' || job.status === 'REJECTED')) {
    actions.push({ key: 'delete', label: 'Delete post', icon: Trash2, onClick: onDelete, tone: 'danger' });
  }

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = actions.length * ITEM_HEIGHT + 12;
    const fitsBelow = rect.bottom + MENU_OFFSET + estimatedHeight < window.innerHeight - VIEWPORT_PADDING;

    setPosition({
      top: fitsBelow ? rect.bottom + MENU_OFFSET : Math.max(VIEWPORT_PADDING, rect.top - MENU_OFFSET - estimatedHeight),
      left: Math.min(
        Math.max(VIEWPORT_PADDING, rect.right - MENU_WIDTH),
        window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING,
      ),
    });
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={isPending}
        onClick={toggleMenu}
        aria-label="Actions"
        aria-expanded={isOpen}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              const className = `flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors hover:bg-slate-50 ${
                action.tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700'
              }`;

              if (action.href) {
                return (
                  <Link key={action.key} href={action.href} className={className} onClick={() => setIsOpen(false)}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{action.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={action.key}
                  type="button"
                  role="menuitem"
                  className={className}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
