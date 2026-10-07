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
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm text-slate-500', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {showHome && (
          <li className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-emerald-600">
              <Home className="h-3.5 w-3.5 text-slate-400" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="ml-1.5 h-3.5 w-3.5 text-slate-300 sm:ml-2" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="flex items-center gap-1.5 transition-colors hover:text-emerald-600">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && <ChevronRight className="ml-1.5 h-3.5 w-3.5 text-slate-300 sm:ml-2" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
