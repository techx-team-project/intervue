import { cn } from '@/lib/utils';

type ConnectBootScreenProps = {
  progress?: number;
  label?: string;
  fading?: boolean;
};

export default function ConnectBootScreen({
  progress = 28,
  label = 'Loading conversations, please wait...',
  fading = false,
}: ConnectBootScreenProps) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading InterVue Connect"
      className={cn(
        'fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white transition-opacity duration-200',
        fading ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      {/* Top progress bar */}
      <div className="fixed top-0 right-0 left-0 h-[3px] bg-slate-100">
        <div
          className="bg-primary h-full shadow-[0_0_8px_rgba(0,177,79,0.4)] transition-[width] duration-200 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Center spinner ring + progress status */}
      <div className="flex flex-col items-center px-6 text-center">
        <div className="border-t-primary h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200" />
        <p className="mt-4 text-[13px] font-medium text-slate-500 tabular-nums">
          {label} {clampedProgress}%
        </p>
      </div>
    </div>
  );
}
