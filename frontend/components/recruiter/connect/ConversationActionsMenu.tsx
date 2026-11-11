'use client';

import { Ban, Flag, MoreVertical, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ConversationActionsMenuProps = {
  onBlock: () => void;
  onUnblock?: () => void;
  isUnblocking?: boolean;
  onReport: () => void;
  blocked: boolean;
  canBlock?: boolean;
  canUnblock?: boolean;
};

const MENU_WIDTH = 210;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;

export default function ConversationActionsMenu({
  onBlock,
  onUnblock,
  isUnblocking = false,
  onReport,
  blocked,
  canBlock = true,
  canUnblock = false,
}: ConversationActionsMenuProps) {
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

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = 96;
    const rawLeft = rect.right - MENU_WIDTH;

    setPosition({
      top: Math.min(rect.bottom + MENU_OFFSET, window.innerHeight - estimatedHeight - VIEWPORT_PADDING),
      left: Math.min(Math.max(VIEWPORT_PADDING, rawLeft), window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING),
    });
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Conversation options"
        aria-expanded={isOpen}
        className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="border-outline-variant shadow-elevation-2 fixed z-[60] overflow-hidden rounded-lg border bg-white py-1"
          >
            {canBlock && !blocked && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onBlock();
                }}
                className="text-body-md text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left font-medium transition-colors"
              >
                <Ban className="h-4 w-4" />
                <span>Block conversation</span>
              </button>
            )}
            {blocked && canUnblock && onUnblock && (
              <button
                type="button"
                role="menuitem"
                disabled={isUnblocking}
                onClick={() => {
                  setIsOpen(false);
                  onUnblock();
                }}
                className="text-body-md text-primary hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left font-medium transition-colors disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isUnblocking ? 'Unblocking...' : 'Unblock conversation'}</span>
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onReport();
              }}
              className="text-error text-body-md hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left font-medium transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span>Report conversation</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
