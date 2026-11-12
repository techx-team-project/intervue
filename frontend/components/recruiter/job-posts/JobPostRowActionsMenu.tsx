'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import {
  ArrowUpCircle,
  Copy,
  Eye,
  History,
  MoreVertical,
  Pause,
  Pencil,
  PlayCircle,
  RefreshCw,
  Square,
  Trash2,
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
  onRetop: () => void;
  onClose: () => void;
  onDuplicate: () => void;
  onRenew: () => void;
  onHistory: () => void;
  onDelete: () => void;
}

interface MenuAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  tone?: 'default' | 'danger';
}

const EDITABLE_STATUSES = new Set(['DRAFT', 'PUBLISHED', 'PAUSED']);

const MENU_WIDTH = 208;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;
const ITEM_HEIGHT = 36;

function buildActions(props: JobPostRowActionsMenuProps): MenuAction[] {
  const { job } = props;
  const base = `${ROUTES.RECRUITER_JOBS}/${job.id}`;
  const actions: MenuAction[] = [];

  if (EDITABLE_STATUSES.has(job.status)) {
    actions.push({ key: 'edit', label: 'Chỉnh sửa', icon: Pencil, href: `${base}/edit` });
  }
  actions.push({ key: 'preview', label: 'Xem trước', icon: Eye, href: `${base}/preview` });

  if (job.status === 'PUBLISHED') {
    actions.push({ key: 'retop', label: 'Đẩy top tin', icon: ArrowUpCircle, onClick: props.onRetop });
    actions.push({ key: 'pause', label: 'Tạm dừng', icon: Pause, onClick: props.onPause });
  }
  if (job.status === 'PAUSED') {
    actions.push({ key: 'reopen', label: 'Mở lại', icon: PlayCircle, onClick: props.onReopen });
  }
  if (job.status === 'PUBLISHED' || job.status === 'PAUSED') {
    actions.push({ key: 'close', label: 'Đóng tin', icon: Square, onClick: props.onClose, tone: 'danger' });
  }

  if (job.status === 'CLOSED' || job.status === 'EXPIRED') {
    actions.push({ key: 'renew', label: 'Gia hạn / Đăng lại', icon: RefreshCw, onClick: props.onRenew });
  }
  actions.push({ key: 'duplicate', label: 'Nhân bản', icon: Copy, onClick: props.onDuplicate });
  actions.push({ key: 'history', label: 'Lịch sử', icon: History, onClick: props.onHistory });

  if (job.status === 'DRAFT') {
    actions.push({ key: 'delete', label: 'Xóa bản nháp', icon: Trash2, onClick: props.onDelete, tone: 'danger' });
  }
  return actions;
}

export default function JobPostRowActionsMenu(props: JobPostRowActionsMenuProps) {
  const { isPending } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const actions = buildActions(props);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

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
        aria-label="Thao tác"
        aria-expanded={isOpen}
        className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="border-outline-variant shadow-elevation-2 fixed z-[60] overflow-hidden rounded-xl border bg-white py-1.5"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              const className = `flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-body-md font-medium transition-colors hover:bg-surface-container-low ${
                action.tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-on-surface'
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
