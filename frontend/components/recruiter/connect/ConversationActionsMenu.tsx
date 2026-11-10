'use client';

import { Ban, Flag, MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ConversationActionsMenuProps = {
  onBlock: () => void;
  onReport: () => void;
  blocked: boolean;
};

const MENU_WIDTH = 200;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;

export default function ConversationActionsMenu({ onBlock, onReport, blocked }: ConversationActionsMenuProps) {
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

  // Portalled to the body so it is never clipped by the scrollable thread column,
  // same fix as ApplicationStatusMenu/JobPostRowActionsMenu.
  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = 88;
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
        aria-label="Tuỳ chọn hội thoại"
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
            className="border-outline-variant shadow-elevation-2 fixed z-[60] overflow-hidden rounded-xl border bg-white py-1.5"
          >
            {!blocked && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onBlock();
                }}
                className="text-body-md text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left font-medium transition-colors"
              >
                <Ban className="h-4 w-4" />
                <span>Chặn cuộc trò chuyện</span>
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onReport();
              }}
              className="text-error text-body-md hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left font-medium transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span>Báo cáo</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
