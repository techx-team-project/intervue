import { cn } from '@/lib/utils';

interface CandidateAvatarProps {
  fullName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-label-sm',
  md: 'h-10 w-10 text-body-md',
  lg: 'h-14 w-14 text-[17px]',
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function CandidateAvatar({ fullName, size = 'md', className }: CandidateAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-surface-container-high text-navy inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        SIZE_CLASS[size],
        className,
      )}
    >
      {getInitials(fullName)}
    </span>
  );
}
