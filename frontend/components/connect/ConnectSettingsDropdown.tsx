'use client';

import { Bell, FileText, Settings, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ConnectSettingsDropdownProps = {
  onOpenRules?: () => void;
};

export default function ConnectSettingsDropdown({ onOpenRules }: ConnectSettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedNotif = localStorage.getItem('connect_receive_notifications');
      return savedNotif !== null ? savedNotif === 'true' : true;
    } catch {
      return true;
    }
  });

  const [notificationSound, setNotificationSound] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedSound = localStorage.getItem('connect_notification_sound');
      return savedSound !== null ? savedSound === 'true' : true;
    } catch {
      return true;
    }
  });

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleNotif = (val: boolean) => {
    setReceiveNotifications(val);
    try {
      localStorage.setItem('connect_receive_notifications', String(val));
      if (val && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        void Notification.requestPermission();
      }
    } catch {}
  };

  const toggleSound = (val: boolean) => {
    setNotificationSound(val);
    try {
      localStorage.setItem('connect_notification_sound', String(val));
    } catch {}
  };

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);
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
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dropdownWidth = 264;
    const maxLeft = Math.max(12, window.innerWidth - dropdownWidth - 12);
    setPosition({
      top: rect.bottom + 6,
      left: Math.min(Math.max(12, rect.left), maxLeft),
    });
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        title="Settings"
        aria-label="Settings"
        aria-expanded={isOpen}
        className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors"
      >
        <Settings className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: 264 }}
            className="fixed z-[60] rounded-md border border-slate-200 bg-white p-2 shadow-lg"
          >
            <div className="space-y-1">
              {/* Notification toggle */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleNotif(!receiveNotifications)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleNotif(!receiveNotifications);
                }}
                className="hover:bg-surface-container-low flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 transition-colors"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <Bell className="h-4 w-4 text-slate-500" />
                  Receive notifications
                </span>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    receiveNotifications ? 'bg-[#00b14f]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      receiveNotifications ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </div>

              {/* Sound toggle */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleSound(!notificationSound)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleSound(!notificationSound);
                }}
                className="hover:bg-surface-container-low flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 transition-colors"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  Notification sounds
                </span>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    notificationSound ? 'bg-[#00b14f]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      notificationSound ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </div>

              {onOpenRules && (
                <>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenRules();
                    }}
                    className="hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-slate-500" />
                    Community guidelines
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
