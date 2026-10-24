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
    actions.push({ key: 'edit', label: 'Edit', icon: Pencil, href: `${ROUTES.RECRUITER_JOBS}/${job.id}/edit` });
  }

  actions.push({ key: 'preview', label: 'Preview', icon: Eye, onClick: onPreview });

  if (job.status !== 'DRAFT') {
    actions.push({
      key: 'applications',
      label: 'Applications',
      icon: Users,
      href: `${ROUTES.RECRUITER_APPLICATIONS}?job=${job.id}`,
    });
  }

  if (job.status === 'DRAFT' || job.status === 'REJECTED') {
    actions.push({ key: 'submit', label: 'Submit for review', icon: SendHorizontal, onClick: onSubmitForReview });
  }

  if (job.status === 'PUBLISHED') {
    actions.push({ key: 'pause', label: 'Pause', icon: Pause, onClick: onPause });
    actions.push({ key: 'extend', label: 'Extend', icon: TimerReset, onClick: onExtend });
  }

  if (job.status === 'PAUSED') {
    actions.push({ key: 'reopen', label: 'Reopen', icon: PlayCircle, onClick: onReopen });
  }

  if (job.status === 'PUBLISHED' || job.status === 'PAUSED') {
    actions.push({ key: 'close', label: 'Close post', icon: Square, onClick: onClose, tone: 'danger' });
  }

  if (job.status === 'EXPIRED') {
    actions.push({ key: 'repost', label: 'Repost', icon: RotateCcw, onClick: onRepost });
  }

  if (job.status === 'REJECTED') {
    actions.push({ key: 'reason', label: 'View rejection reason', icon: AlertCircle, onClick: onViewRejectionReason });
  }

  actions.push({ key: 'duplicate', label: 'Duplicate', icon: Copy, onClick: onDuplicate });

  // Portalled to the body so the menu is not clipped by the horizontally
  // scrollable table wrapper it sits inside.
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
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
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
                  role="menuitem"
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
          </div>,
          document.body,
        )}
    </>
  );
}
