import { APPLICATIONS_BOARD_VARIANTS, type ApplicationsBoardVariant } from '@/constants/application-board';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BoardVariantNavProps {
  current: ApplicationsBoardVariant;
}

export default function BoardVariantNav({ current }: BoardVariantNavProps) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#e5e9ef] bg-white p-1.5 shadow-xs">
      <span className="px-2 text-[11.5px] font-bold text-[#94a3b8]">Phong cách:</span>

      {APPLICATIONS_BOARD_VARIANTS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          aria-current={item.id === current}
          className={cn(
            'rounded-xl px-3 py-1.5 text-[12.5px] font-bold transition-colors',
            item.id === current ? 'bg-navy text-white' : 'text-[#64748b] hover:bg-slate-100 hover:text-slate-800',
          )}
        >
          {item.label}
        </Link>
      ))}

      <Link
        href={ROUTES.RECRUITER_APPLICATIONS}
        className="ml-auto rounded-xl px-3 py-1.5 text-[12px] font-bold text-[#94a3b8] transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        So sánh 4 phong cách
      </Link>
    </nav>
  );
}
