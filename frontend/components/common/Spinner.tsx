import { cn } from '@/lib/utils';

type SpinnerProps = { className?: string };

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent', className)}
    />
  );
}
