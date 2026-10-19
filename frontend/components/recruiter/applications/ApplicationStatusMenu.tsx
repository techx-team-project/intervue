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

interface ApplicationStatusMenuProps {
  currentStatus?: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
  trigger?: 'icon' | 'button';
  align?: 'left' | 'right';
  disabled?: boolean;
  label?: string;
}

export default function ApplicationStatusMenu({
  currentStatus,
  onSelect,
  trigger = 'button',
  align = 'right',
  disabled = false,
  label = 'Chuyển trạng thái',
}: ApplicationStatusMenuProps) {
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

  const options = [...ACTIVE_APPLICATION_STATUSES, ...CLOSING_APPLICATION_STATUSES].filter(
    (status) => status !== currentStatus,
  );

  return (
    <div ref={menuRef} className="relative">
      {trigger === 'icon' ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={label}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MoveRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((previous) => !previous)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{label}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute top-9 z-40 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <p className="px-3.5 pt-1 pb-2 text-[11px] font-bold text-slate-400">Chuyển hồ sơ sang</p>
          {options.map((status) => (
            <button
              key={status}
              type="button"
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
        </div>
      )}
    </div>
  );
}
