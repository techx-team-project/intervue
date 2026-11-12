import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  name: string;
  src?: string;
  className?: string;
}

const MONOGRAM_TONES = [
  'bg-emerald-100 text-emerald-900',
  'bg-lime-100 text-lime-900',
  'bg-amber-100 text-amber-900',
  'bg-sky-100 text-sky-900',
  'bg-rose-100 text-rose-900',
  'bg-stone-200 text-stone-800',
];

const MAX_INITIALS = 2;

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, MAX_INITIALS)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || '?'
  );
}

function toneFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return MONOGRAM_TONES[hash % MONOGRAM_TONES.length];
}

export default function CompanyLogo({ name, src, className }: CompanyLogoProps) {
  return (
    <div
      className={cn(
        'border-outline-variant @container flex shrink-0 items-center justify-center overflow-hidden rounded-xl border',
        src ? 'bg-white' : toneFor(name),
        className ?? 'h-14 w-14',
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-contain p-1.5" loading="lazy" />
      ) : (
        <span aria-label={name} className="font-display text-[38cqw] leading-none font-extrabold tracking-tight">
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}
