'use client';

import { isMovableStatus } from '@/constants/application-status';
import type { ApplicationStatus, RecruiterApplication } from '@/types/recruiter-application';
import { useDraggable } from '@dnd-kit/core';
import type { PointerEventHandler } from 'react';
import ApplicationCard, { type ApplicationCardVariant } from './ApplicationCard';

interface DraggableApplicationCardProps {
  application: RecruiterApplication;
  variant?: ApplicationCardVariant;
  isActive?: boolean;
  isSelected?: boolean;
  showJobTitle?: boolean;
  showStatusBadge?: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
  onToggleSelected?: () => void;
  onChangeStatus: (status: ApplicationStatus) => void;
}

export default function DraggableApplicationCard({ application, ...cardProps }: DraggableApplicationCardProps) {
  const isDraggable = isMovableStatus(application.status);
  const { listeners, setNodeRef, isDragging } = useDraggable({
    id: application.id,
    data: { status: application.status },
    disabled: !isDraggable,
  });

  const { onPointerDown } = (listeners ?? {}) as { onPointerDown?: PointerEventHandler<HTMLDivElement> };

  // Only the pointer listener is bound: keyboard users change status through the
  // "Chuyển trạng thái" menu instead of a keyboard drag, which conflicts with
  // Enter/Space opening the application detail.
  return (
    <div ref={setNodeRef} onPointerDown={onPointerDown} className={isDraggable ? 'touch-none' : undefined}>
      <ApplicationCard application={application} isDragging={isDragging} {...cardProps} />
    </div>
  );
}
