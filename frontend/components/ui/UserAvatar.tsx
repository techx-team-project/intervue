import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface UserAvatarProps {
  fullName: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-[13px]',
  lg: 'h-14 w-14 text-[17px]',
};

const SIZE_PX = { sm: 32, md: 40, lg: 56 };

const PALETTE = [
  'bg-linear-to-br from-sky-500 to-sky-600',
  'bg-linear-to-br from-violet-500 to-violet-600',
  'bg-linear-to-br from-emerald-500 to-emerald-600',
  'bg-linear-to-br from-amber-500 to-amber-600',
  'bg-linear-to-br from-rose-500 to-rose-600',
  'bg-linear-to-br from-indigo-500 to-indigo-600',
  'bg-linear-to-br from-teal-500 to-teal-600',
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getPaletteIndex(fullName: string): number {
  let hash = 0;
  for (let index = 0; index < fullName.length; index += 1) {
    hash = (hash + fullName.charCodeAt(index)) % PALETTE.length;
  }
  return hash;
}

export default function UserAvatar({ fullName, image, size = 'md', className }: UserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={fullName}
        width={SIZE_PX[size]}
        height={SIZE_PX[size]}
        className={cn('shrink-0 rounded-xl object-cover shadow-2xs', SIZE_CLASS[size], className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl font-black text-white shadow-2xs',
        SIZE_CLASS[size],
        PALETTE[getPaletteIndex(fullName)],
        className,
      )}
    >
      {getInitials(fullName)}
    </span>
  );
}
