import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function QuickActionCard({ title, description, href, icon: Icon }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group border-outline-variant rounded-2xl border bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-sm"
    >
      <div className="text-primary flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-navy text-body-md mt-3 font-bold">{title}</h3>
      <p className="text-body-sm text-on-surface-variant mt-1">{description}</p>
      <span className="text-primary text-body-sm mt-3 inline-flex items-center gap-1 font-bold">
        <span>Get started</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
