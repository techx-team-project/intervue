import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface UserAvatarProps {
  fullName: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-label-sm',
  md: 'h-10 w-10 text-body-md',
  lg: 'h-14 w-14 text-[17px]',
};

const SIZE_PX = { sm: 32, md: 40, lg: 56 };

const PALETTE = ['bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-primary'];

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
        'inline-flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-2xs',
        SIZE_CLASS[size],
        PALETTE[getPaletteIndex(fullName)],
        className,
      )}
    >
      {getInitials(fullName)}
    </span>
  );
}
