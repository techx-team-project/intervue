import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-on-surface-variant flex items-center text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {showHome && (
          <li className="flex items-center">
            <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
              <Home className="text-outline h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="text-outline ml-1.5 h-3.5 w-3.5 sm:ml-2" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary flex items-center gap-1.5 transition-colors">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-on-surface flex items-center gap-1.5 font-semibold">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && <ChevronRight className="text-outline ml-1.5 h-3.5 w-3.5 sm:ml-2" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
