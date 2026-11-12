import { cn } from '@/lib/utils';

const SEGMENTS = 28;
const SCALE_HEADROOM = 1.25;

type SalaryRangeBarProps = {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  marketAverage?: number;
  marketLabel?: string;
};

export default function SalaryRangeBar({
  min,
  max,
  minLabel,
  maxLabel,
  marketAverage,
  marketLabel,
}: SalaryRangeBarProps) {
  const scaleMax = Math.max(max, marketAverage ?? 0) * SCALE_HEADROOM;
  const startIndex = Math.floor((min / scaleMax) * SEGMENTS);
  const endIndex = Math.max(startIndex + 1, Math.ceil((max / scaleMax) * SEGMENTS));
  const averageIndex =
    marketAverage === undefined ? -1 : Math.min(SEGMENTS - 1, Math.floor((marketAverage / scaleMax) * SEGMENTS));
  const segments = Array.from({ length: SEGMENTS }, (_, index) => index);

  return (
    <div aria-hidden className="pt-7 sm:pb-7">
      <div className="flex gap-[3px]">
        {segments.map((index) => (
          <span key={index} className="relative flex-1">
            <span
              className={cn(
                'block h-4 rounded-full',
                index >= startIndex && index < endIndex ? 'bg-primary' : 'bg-surface-container-high',
              )}
            />
            {index === averageIndex && marketLabel && (
              <span className="absolute -top-7 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <span className="text-label-md text-on-surface-variant font-semibold whitespace-nowrap">
                  {marketLabel}
                </span>
                <span className="bg-on-surface-variant h-5 w-px" />
              </span>
            )}
            {index === startIndex && (
              <span className="text-label-lg text-on-surface absolute top-5 left-0 font-semibold whitespace-nowrap max-sm:hidden">
                {minLabel}
              </span>
            )}
            {index === endIndex - 1 && (
              <span className="text-label-lg text-on-surface absolute top-5 right-0 font-semibold whitespace-nowrap max-sm:hidden">
                {maxLabel}
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="text-label-lg text-on-surface mt-3 font-semibold sm:hidden">
        {minLabel} - {maxLabel}
      </p>
    </div>
  );
}
