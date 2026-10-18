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
      className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-sm"
    >
      <div className="text-primary flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-navy mt-3 text-[14.5px] font-bold">{title}</h3>
      <p className="mt-1 text-[12.5px] text-[#64748b]">{description}</p>
      <span className="text-primary mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold">
        <span>Bắt đầu</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
