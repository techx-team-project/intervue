import { cn } from '@/lib/utils';

type CatEmptyIllustrationProps = {
  className?: string;
  title?: string;
  description?: string;
};

export default function CatEmptyIllustration({
  className,
  title = 'No conversations yet...',
  description,
}: CatEmptyIllustrationProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80"
        aria-hidden="true"
      >
        {/* Cat ears */}
        <path d="M42 50 L30 26 L56 36 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M98 50 L110 26 L84 36 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Cat head */}
        <ellipse cx="70" cy="58" rx="38" ry="30" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Cat eyes (cute sad/drooping eyes like TopCV) */}
        <path d="M52 56 Q58 50 64 56" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M76 56 Q82 50 88 56" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cat nose and mouth */}
        <path d="M70 63 L67 66 H73 Z" fill="#94a3b8" />
        <path d="M70 66 Q65 72 61 68" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M70 66 Q75 72 79 68" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Sweat drops */}
        <path d="M36 44 Q34 40 37 38 Q40 40 38 44 Z" fill="#93c5fd" />
        <path d="M104 44 Q102 40 105 38 Q108 40 106 44 Z" fill="#93c5fd" />

        {/* Cat body / paws */}
        <path d="M48 84 C48 74 92 74 92 84 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2.5" />
        <ellipse cx="56" cy="85" rx="6" ry="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <ellipse cx="84" cy="85" rx="6" ry="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />

        {/* Briefcase */}
        <rect x="52" y="86" width="36" height="26" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
        <path
          d="M63 86 V82 C63 80 77 80 77 82 V86"
          stroke="#64748b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="52" y1="95" x2="88" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="70" cy="95" r="2.5" fill="#64748b" />
      </svg>

      <p className="mt-3 text-sm font-medium text-slate-500">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}
