'use client';

import type { ApplicationBoardViewProps } from '@/hooks/useApplicationBoard';
import { MousePointerClick } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import ApplicationBoardColumn from './ApplicationBoardColumn';

interface SplitBoardProps extends ApplicationBoardViewProps {
  inspector: ReactNode;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export default function SplitBoard({
  columns,
  visibleApplications,
  handlers,
  totalVisible,
  activeApplicationId,
  selectedIds,
  showJobTitle,
  inspector,
}: SplitBoardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'j' && event.key !== 'k') return;
      if (isTypingTarget(event.target) || visibleApplications.length === 0) return;

      const currentIndex = visibleApplications.findIndex((application) => application.id === activeApplicationId);
      const step = event.key === 'j' ? 1 : -1;
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + step + visibleApplications.length) % visibleApplications.length;

      handlers.onOpen(visibleApplications[nextIndex]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleApplications, activeApplicationId, handlers]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="min-w-0">
        <div className="mb-2.5 flex items-center gap-2 text-[11.5px] text-[#94a3b8]">
          <span className="rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 font-bold text-[#64748b]">J</span>
          <span className="rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 font-bold text-[#64748b]">K</span>
          <span>để duyệt nhanh từng hồ sơ mà không cần rời bàn phím</span>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="flex min-w-max items-stretch gap-3">
            {columns.map((column) => (
              <ApplicationBoardColumn
                key={column.meta.id}
                column={column}
                handlers={handlers}
                cardVariant="compact"
                headerStyle="plain"
                totalVisible={totalVisible}
                activeApplicationId={activeApplicationId}
                selectedIds={selectedIds}
                showJobTitle={showJobTitle}
                showStatusBadge={column.meta.id === 'CLOSED'}
                className="w-[250px] shrink-0"
                bodyClassName="max-h-[calc(100vh-20rem)] min-h-[14rem]"
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-9rem)]">
        <div className="flex h-full min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-[#e5e9ef] bg-white shadow-xs">
          {inspector ?? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
              <MousePointerClick className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-navy text-[13px] font-bold">Chọn một hồ sơ để xem chi tiết</p>
              <p className="max-w-[16rem] text-[11.5px] leading-relaxed text-[#94a3b8]">
                Bấm vào một thẻ ứng viên, hoặc dùng phím J và K để duyệt lần lượt từng hồ sơ.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
