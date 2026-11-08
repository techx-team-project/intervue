import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'error';
  className?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-shape-lg border-outline-variant flex flex-col items-center gap-3 border px-6 py-12 text-center',
        className,
      )}
    >
      <Icon className={cn('h-8 w-8', tone === 'error' ? 'text-error' : 'text-on-surface-variant')} aria-hidden />
      <div className="space-y-1">
        <p className="text-title-md text-on-surface">{title}</p>
        {description && <p className="text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
