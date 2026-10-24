'use client';

import {
  ACTIVE_APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
  CLOSING_APPLICATION_STATUSES,
} from '@/constants/application-status';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/recruiter-application';
import { ChevronDown, MoveRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ApplicationStatusMenuProps {
  currentStatus?: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
  trigger?: 'icon' | 'button';
  align?: 'left' | 'right';
  disabled?: boolean;
  label?: string;
}

const MENU_WIDTH = 248;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;
const ITEM_HEIGHT = 38;

export default function ApplicationStatusMenu({
  currentStatus,
  onSelect,
  trigger = 'button',
  align = 'right',
  disabled = false,
  label = 'Change status',
}: ApplicationStatusMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const options = [...ACTIVE_APPLICATION_STATUSES, ...CLOSING_APPLICATION_STATUSES].filter(
    (status) => status !== currentStatus,
  );

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

  // The menu is portalled to the body so it is never clipped by the scrollable
  // board column or the overflow-hidden hero card it is rendered inside.
  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = (currentStatus ? 62 : 36) + options.length * ITEM_HEIGHT;
    const fitsBelow = rect.bottom + MENU_OFFSET + estimatedHeight < window.innerHeight - VIEWPORT_PADDING;
    const rawLeft = align === 'right' ? rect.right - MENU_WIDTH : rect.left;

    setPosition({
      top: fitsBelow ? rect.bottom + MENU_OFFSET : Math.max(VIEWPORT_PADDING, rect.top - MENU_OFFSET - estimatedHeight),
      left: Math.min(Math.max(VIEWPORT_PADDING, rawLeft), window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING),
    });
    setIsOpen(true);
  };

  return (
    <>
      {trigger === 'icon' ? (
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={toggleMenu}
          aria-label={label}
          aria-expanded={isOpen}
          className={cn(
            'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:h-7 sm:w-7',
            isOpen ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
          )}
        >
          <MoveRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{label}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
        </button>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl"
          >
            <div className="border-b border-slate-100 px-3.5 pt-1 pb-2">
              <p className="text-[11px] font-bold text-slate-400">Move application to</p>
              {currentStatus && (
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Currently:</span>
                  <span
                    className={cn(
                      'rounded-full border px-1.5 py-0.5 text-[10.5px] font-bold',
                      APPLICATION_STATUS_META[currentStatus].chipClassName,
                    )}
                  >
                    {APPLICATION_STATUS_META[currentStatus].label}
                  </span>
                </p>
              )}
            </div>

            {options.map((status) => (
              <button
                key={status}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onSelect(status);
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span className={cn('h-2 w-2 shrink-0 rounded-full', APPLICATION_STATUS_META[status].chipClassName)} />
                <span>{APPLICATION_STATUS_META[status].label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
