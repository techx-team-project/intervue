'use client';

import type { ApplicationBoardViewProps } from '@/hooks/useApplicationBoard';
import { useSyncExternalStore } from 'react';
import ApplicationBoardColumn from './ApplicationBoardColumn';
import BoardInsightStrip from './BoardInsightStrip';

const CLOSED_COLLAPSED_STORAGE_KEY = 'intervue.recruiter.applications.closedColumnCollapsed';
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return localStorage.getItem(CLOSED_COLLAPSED_STORAGE_KEY) === 'true';
}

function getServerSnapshot() {
  return false;
}

function setClosedColumnCollapsed(value: boolean) {
  localStorage.setItem(CLOSED_COLLAPSED_STORAGE_KEY, String(value));
  listeners.forEach((callback) => callback());
}

export default function CommandCenterBoard({
  columns,
  visibleApplications,
  handlers,
  totalVisible,
  activeApplicationId,
  selectedIds,
  showJobTitle,
}: ApplicationBoardViewProps) {
  const isClosedCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="space-y-4">
      <BoardInsightStrip applications={visibleApplications} />

      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex min-w-max items-stretch gap-3.5">
          {columns.map((column) => {
            const isClosedColumn = column.meta.id === 'CLOSED';

            return (
              <ApplicationBoardColumn
                key={column.meta.id}
                column={column}
                handlers={handlers}
                cardVariant="rich"
                headerStyle="metrics"
                totalVisible={totalVisible}
                activeApplicationId={activeApplicationId}
                selectedIds={selectedIds}
                showJobTitle={showJobTitle}
                showStatusBadge={isClosedColumn}
                isCollapsed={isClosedColumn && isClosedCollapsed}
                onToggleCollapse={isClosedColumn ? () => setClosedColumnCollapsed(!isClosedCollapsed) : undefined}
                className="w-[304px] shrink-0"
                bodyClassName="max-h-[calc(100vh-22rem)] min-h-[16rem]"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
