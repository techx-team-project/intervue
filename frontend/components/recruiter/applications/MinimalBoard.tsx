'use client';

import type { ApplicationBoardViewProps } from '@/hooks/useApplicationBoard';
import ApplicationBoardColumn from './ApplicationBoardColumn';

export default function MinimalBoard({
  columns,
  handlers,
  totalVisible,
  activeApplicationId,
  selectedIds,
  showJobTitle,
}: ApplicationBoardViewProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-2">
      <div className="flex min-w-max items-stretch gap-3">
        {columns.map((column) => (
          <ApplicationBoardColumn
            key={column.meta.id}
            column={column}
            handlers={handlers}
            cardVariant="minimal"
            headerStyle="plain"
            totalVisible={totalVisible}
            activeApplicationId={activeApplicationId}
            selectedIds={selectedIds}
            showJobTitle={showJobTitle}
            showStatusBadge={column.meta.id === 'CLOSED'}
            className="w-[232px] shrink-0 border-[#e9edf2] bg-white"
            bodyClassName="max-h-[calc(100vh-19rem)] min-h-[14rem]"
          />
        ))}
      </div>
    </div>
  );
}
