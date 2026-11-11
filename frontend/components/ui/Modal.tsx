'use client';

import React, { useCallback, useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showCloseButton?: boolean;
  className?: string;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  showCloseButton = true,
  className,
}: ModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panelRef, isOpen && isClient);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 h-screen w-screen bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'border-outline-variant shadow-elevation-2 relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-3xl border bg-white p-6 transition duration-200 outline-none sm:p-7',
          maxWidthMap[maxWidth],
          className,
        )}
      >
        {(title || showCloseButton) && (
          <div className="border-outline-variant flex items-start justify-between gap-4 border-b pb-4">
            <div>
              {title && typeof title === 'string' ? (
                <h3 id={titleId} className="text-on-surface text-lg font-bold sm:text-xl">
                  {title}
                </h3>
              ) : (
                title && <div id={titleId}>{title}</div>
              )}
              {description && (
                <p id={descriptionId} className="text-on-surface-variant mt-1 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-outline hover:bg-surface-container-high hover:text-on-surface shrink-0 cursor-pointer rounded-xl p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="py-4">{children}</div>

        {footer && <div className="border-outline-variant mt-2 flex justify-end gap-2 border-t pt-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
