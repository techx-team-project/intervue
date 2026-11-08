import { cn } from '@/lib/utils';

type SkeletonProps = { className?: string };

export default function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn('bg-surface-container-high rounded-shape-sm animate-pulse', className)} />;
}
