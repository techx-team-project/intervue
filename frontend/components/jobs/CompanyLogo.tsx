import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  name: string;
  src?: string;
  className?: string;
}

export default function CompanyLogo({ name, src, className }: CompanyLogoProps) {
  return (
    <div
      className={cn(
        'border-outline-variant flex shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white',
        className ?? 'h-14 w-14',
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-contain p-1.5" loading="lazy" />
      ) : (
        <Building2 className="text-outline h-1/2 w-1/2" aria-hidden />
      )}
    </div>
  );
}
