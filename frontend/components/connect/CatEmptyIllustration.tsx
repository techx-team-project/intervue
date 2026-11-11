import { cn } from '@/lib/utils';

type CatEmptyIllustrationProps = {
  className?: string;
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function CatEmptyIllustration({
  className,
  title = 'No conversations yet...',
  description,
  compact = false,
}: CatEmptyIllustrationProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <svg
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(compact ? 'h-28 w-36' : 'h-40 w-48')}
        aria-hidden="true"
      >
        {/* Organic halo backdrop */}
        <path
          d="M52 132 C34 114 38 72 68 58 C88 38 144 36 168 62 C196 74 202 118 182 142 C168 164 132 174 96 170 C68 168 58 146 52 132 Z"
          fill="#f8fafc"
        />

        {/* Ambient bokeh circles */}
        <circle cx="26" cy="112" r="10" fill="#f1f5f9" />
        <circle cx="102" cy="24" r="5" fill="#f1f5f9" />
        <circle cx="208" cy="100" r="12" fill="#f1f5f9" />
        <circle cx="48" cy="48" r="4" fill="#f1f5f9" />

        {/* Friendly floating chat bubble */}
        <g>
          <path
            d="M168 38 H194 C198.4 38 202 41.6 202 46 V58 C202 62.4 198.4 66 194 66 H178 L169 72 V66 H168 C163.6 66 160 62.4 160 58 V46 C160 41.6 163.6 38 168 38 Z"
            fill="#ecfdf5"
            stroke="#6ee7b7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="173" cy="52" r="2" fill="#10b981" />
          <circle cx="181" cy="52" r="2" fill="#10b981" />
          <circle cx="189" cy="52" r="2" fill="#10b981" />
        </g>

        {/* Ground baseline */}
        <line x1="58" y1="172" x2="188" y2="172" stroke="#cbd5e1" strokeWidth="1.75" strokeLinecap="round" />

        {/* Curled tail */}
        <path
          d="M142 148 C164 146 184 156 178 167 C174 172 158 172 142 168 Z"
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Seated body */}
        <path
          d="M84 114 C78 128 78 156 84 172 H142 C148 152 146 128 138 114 Z"
          fill="#ffffff"
          stroke="#94a3b8"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <ellipse cx="114" cy="142" rx="18" ry="18" fill="#f8fafc" />

        {/* Cat head & fluffy cheeks */}
        <path
          d="M74 72 L71 45 C71 41 76 39 79 42 L99 57 C108 55 120 55 129 57 L145 39 C148 36 153 38 153 42 L154 70 C161 73 163 77 157 79 L163 85 L157 88 C160 100 148 116 126 118 C118 119 106 119 98 118 C78 116 66 102 68 89 L62 85 L68 80 L63 76 L74 72 Z"
          fill="#ffffff"
          stroke="#94a3b8"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner ear tint */}
        <path d="M77 61 L76 49 L89 58 Z" fill="#f1f5f9" />
        <path d="M148 59 L147 46 L136 57 Z" fill="#f1f5f9" />

        {/* Forehead stripe accents */}
        <path d="M113 56 V63" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M106 57 V62" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <path d="M120 57 V62" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

        {/* Friendly eyebrows */}
        <path d="M89 74 Q94 71 99 74" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M126 74 Q131 71 136 74" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Expressive glossy eyes */}
        <ellipse cx="95" cy="84" rx="3.8" ry="4.4" fill="#475569" />
        <circle cx="96.5" cy="82.4" r="1.3" fill="#ffffff" />
        <ellipse cx="130" cy="84" rx="3.8" ry="4.4" fill="#475569" />
        <circle cx="131.5" cy="82.4" r="1.3" fill="#ffffff" />

        {/* Rosy cheeks */}
        <ellipse cx="83" cy="94" rx="5.5" ry="3" fill="#fecdd3" opacity="0.7" />
        <ellipse cx="142" cy="94" rx="5.5" ry="3" fill="#fecdd3" opacity="0.7" />

        {/* Cute nose and friendly cat mouth */}
        <path d="M112 91 L109.5 94.5 H114.5 Z" fill="#64748b" />
        <path d="M112 94.5 Q108.5 99 105 96.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M112 94.5 Q115.5 99 119 96.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <path d="M71 89 L80 90" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M72 95 L81 94" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M145 90 L154 89" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M144 94 L153 95" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />

        {/* Briefcase body & handle */}
        <path
          d="M97 132 V126 C97 123 121 123 121 126 V132"
          stroke="#64748b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="78" y="132" width="62" height="40" rx="7" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" />
        <path
          d="M78 144 Q109 156 140 144 V139 C140 135.1 136.9 132 133 132 H85 C81.1 132 78 135.1 78 139 Z"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <rect x="105.5" y="145" width="7" height="9" rx="2.5" fill="#10b981" stroke="#475569" strokeWidth="1.6" />

        {/* Cozy paws gripping top of briefcase */}
        <ellipse cx="92" cy="131" rx="7.5" ry="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.3" />
        <ellipse cx="126" cy="131" rx="7.5" ry="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.3" />
      </svg>

      <p className="mt-2 text-sm font-medium text-slate-600">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}
