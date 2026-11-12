'use client';

import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type SheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  ariaLabel: string;
  placement?: 'bottom' | 'right';
  footer?: ReactNode;
  children: ReactNode;
};

const PLACEMENT_CLASSES = {
  bottom: {
    wrapper: 'items-end justify-center',
    panel: 'animate-fade-in-up max-h-[88dvh] w-full max-w-lg rounded-t-3xl',
  },
  right: {
    wrapper: 'items-stretch justify-end',
    panel: 'animate-fade-in h-full w-full max-w-xl sm:rounded-l-3xl',
  },
};

export default function Sheet({
  isOpen,
  onClose,
  title,
  ariaLabel,
  placement = 'bottom',
  footer,
  children,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isOpen);

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

  const classes = PLACEMENT_CLASSES[placement];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={cn('fixed inset-0 z-100 flex', classes.wrapper)}
    >
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/60" />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn('bg-surface relative z-10 flex flex-col outline-none', classes.panel)}
      >
        <header className="border-outline-variant flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="font-display text-title-lg text-on-surface min-w-0 font-bold">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="state-layer text-on-surface-variant flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="border-outline-variant flex gap-2 border-t px-5 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
