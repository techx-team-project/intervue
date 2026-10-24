import { AI_MATCH_HIGH_THRESHOLD, AI_MATCH_MEDIUM_THRESHOLD } from '@/constants/application-status';
import { cn } from '@/lib/utils';

interface AiMatchRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'h-9 w-9 text-[11px]',
  md: 'h-12 w-12 text-[14px]',
  lg: 'h-16 w-16 text-[19px]',
};

const INNER_SIZE_CLASS = {
  sm: 'inset-[3px]',
  md: 'inset-[4px]',
  lg: 'inset-[5px]',
};

export function getAiMatchTone(score: number): { color: string; track: string; label: string; text: string } {
  if (score >= AI_MATCH_HIGH_THRESHOLD) {
    return { color: '#00b14f', track: '#dcfce7', label: 'Strong match', text: 'text-emerald-700' };
  }
  if (score >= AI_MATCH_MEDIUM_THRESHOLD) {
    return { color: '#f59e0b', track: '#fef3c7', label: 'Good match', text: 'text-amber-700' };
  }
  return { color: '#64748b', track: '#e2e8f0', label: 'Needs a closer look', text: 'text-slate-600' };
}

export default function AiMatchRing({ score, size = 'md', className }: AiMatchRingProps) {
  const tone = getAiMatchTone(score);

  return (
    <span
      role="img"
      aria-label={`AI match score ${score} out of 100 — ${tone.label}`}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full',
        SIZE_CLASS[size],
        className,
      )}
      style={{ background: `conic-gradient(${tone.color} ${score * 3.6}deg, ${tone.track} 0deg)` }}
    >
      <span
        className={cn(
          'absolute flex items-center justify-center rounded-full bg-white font-black',
          INNER_SIZE_CLASS[size],
          tone.text,
        )}
      >
        {score}
      </span>
    </span>
  );
}
