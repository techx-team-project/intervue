import type { ApplicationsBoardVariant } from '@/constants/application-board';

interface BoardVariantPreviewProps {
  variant: ApplicationsBoardVariant;
}

function Column({ cards, className }: { cards: number; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 rounded-md bg-white p-1 ${className ?? ''}`}>
      <span className="h-1.5 rounded-full bg-slate-300" />
      {Array.from({ length: cards }, (_, index) => (
        <span key={index} className="h-4 rounded bg-slate-100" />
      ))}
    </div>
  );
}

export default function BoardVariantPreview({ variant }: BoardVariantPreviewProps) {
  if (variant === 'command-center') {
    return (
      <div className="flex h-32 flex-col gap-1.5 rounded-xl bg-[#f1f5f9] p-2">
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className="h-5 flex-1 rounded bg-white" />
          ))}
        </div>
        <div className="flex flex-1 gap-1.5">
          <Column cards={3} />
          <Column cards={2} />
          <Column cards={2} />
          <Column cards={1} />
          <Column cards={1} />
          <Column cards={1} />
        </div>
      </div>
    );
  }

  if (variant === 'split') {
    return (
      <div className="flex h-32 gap-1.5 rounded-xl bg-[#f1f5f9] p-2">
        <div className="flex flex-[2] gap-1.5">
          <Column cards={3} />
          <Column cards={2} />
          <Column cards={2} />
          <Column cards={1} />
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-md border-2 border-emerald-300 bg-white p-1.5">
          <span className="h-3 w-2/3 rounded bg-slate-300" />
          <span className="h-1.5 w-1/2 rounded bg-slate-200" />
          <span className="mt-1 h-1.5 rounded bg-slate-100" />
          <span className="h-1.5 rounded bg-slate-100" />
          <span className="h-1.5 w-3/4 rounded bg-slate-100" />
          <span className="mt-auto h-3 rounded bg-emerald-100" />
        </div>
      </div>
    );
  }

  if (variant === 'swimlane') {
    return (
      <div className="flex h-32 flex-col gap-1.5 rounded-xl bg-[#f1f5f9] p-2">
        {[3, 2, 1].map((cards, laneIndex) => (
          <div key={laneIndex} className="flex flex-1 flex-col gap-1 rounded-md bg-white p-1">
            <span className="h-1.5 w-1/3 rounded-full bg-slate-300" />
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={`flex-1 rounded ${index < cards ? 'bg-slate-100' : 'bg-slate-50'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-32 gap-1.5 rounded-xl bg-[#f1f5f9] p-2">
      {Array.from({ length: 6 }, (_, index) => (
        <Column key={index} cards={index < 3 ? 2 : 1} />
      ))}
    </div>
  );
}
