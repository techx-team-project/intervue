'use client';

import { useDismissable } from '@/hooks/useDismissable';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useRef, useState } from 'react';

export type NavMenuItem = { href: string; label: string };

type NavMenuProps = {
  label: string;
  items: NavMenuItem[];
};

export default function NavMenu({ label, items }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  useDismissable(containerRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'text-title-sm ease-standard flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 font-medium whitespace-nowrap transition-colors duration-150',
          isOpen || isActive
            ? 'bg-primary-light text-primary'
            : 'text-on-surface hover:bg-surface-container-low hover:text-primary',
        )}
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          className="animate-fade-in-up bg-surface border-outline-variant shadow-float absolute top-full left-0 z-50 mt-3 w-64 rounded-2xl border p-2"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-body-md text-on-surface hover:bg-primary-light hover:text-primary ease-standard flex h-11 items-center rounded-xl px-3 font-medium transition-colors duration-150"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
