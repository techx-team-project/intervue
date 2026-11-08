'use client';

import { useDismissable } from '@/hooks/useDismissable';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';

export type NavMenuItem = { href: string; label: string };

type NavMenuProps = {
  label: string;
  items: NavMenuItem[];
};

export default function NavMenu({ label, items }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
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
        className="text-title-md text-on-surface hover:text-primary ease-standard flex h-12 cursor-pointer items-center gap-1.5 px-4 whitespace-nowrap transition-colors duration-150"
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          className="animate-fade-in-up bg-surface border-outline-variant rounded-shape-md shadow-elevation-2 absolute top-full left-0 z-50 mt-2 w-64 border py-2"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="state-layer text-body-lg text-on-surface flex h-12 items-center px-4"
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
