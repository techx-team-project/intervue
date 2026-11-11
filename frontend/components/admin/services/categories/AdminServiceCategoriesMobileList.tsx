'use client';

import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import { CATEGORY_VISIBILITY_META, getCategoryVisibilityState } from '@/lib/admin-service-categories';
import { cn } from '@/lib/utils';
import type { AdminServiceCategory } from '@/types/admin-service-package';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { GripVertical, Package, SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import AdminServiceCategoryGoalCell from './AdminServiceCategoryGoalCell';

interface AdminServiceCategoriesMobileListProps {
  categories: AdminServiceCategory[];
  sharedNeedMap: Map<string, AdminServiceCategory[]>;
  canReorder: boolean;
  isReordering: boolean;
  busyCategoryId: number | null;
  onRequestDelete: (category: AdminServiceCategory) => void;
  onToggleVisibility: (category: AdminServiceCategory) => void;
  onReorder: (activeId: number, overId: number) => void;
}

interface SortableMobileCardProps {
  category: AdminServiceCategory;
  sharedPeers: AdminServiceCategory[];
  canReorder: boolean;
  isReordering: boolean;
  isBusy: boolean;
  activeId: number | null;
  onRequestDelete: (category: AdminServiceCategory) => void;
  onToggleVisibility: (category: AdminServiceCategory) => void;
}

function SortableMobileCard({
  category,
  sharedPeers,
  canReorder,
  isReordering,
  isBusy,
  activeId,
  onRequestDelete,
  onToggleVisibility,
}: SortableMobileCardProps) {
  const dragDisabled = !canReorder || isReordering;

  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: category.id,
    disabled: dragDisabled,
  });

  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: category.id,
    disabled: dragDisabled,
  });

  const setCardRef = (element: HTMLElement | null) => {
    setDragNodeRef(element);
    setDropNodeRef(element);
  };

  const visibilityMeta = CATEGORY_VISIBILITY_META[getCategoryVisibilityState(category)];

  return (
    <article
      ref={setCardRef}
      className={cn(
        'dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-4 shadow-xs transition',
        isDragging && 'opacity-40',
        isOver && activeId !== null && activeId !== category.id && 'border-slate-400 ring-2 ring-slate-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            ref={setActivatorNodeRef}
            type="button"
            disabled={dragDisabled}
            title={canReorder ? 'Drag to reorder' : 'Clear search and filters to reorder'}
            aria-label={`Drag to reorder ${category.name}`}
            {...(dragDisabled ? {} : attributes)}
            {...(dragDisabled ? {} : listeners)}
            className="text-outline hover:bg-surface-container-high hover:text-navy dark:text-forest-400 dark:hover:bg-forest-800 dark:hover:text-forest-100 mt-0.5 shrink-0 cursor-grab touch-none rounded-lg p-1 transition active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="dark:bg-forest-850 dark:text-forest-200 bg-surface-container-low text-navy rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold">
                #{category.displayOrder}
              </span>
              <h3 className="text-primary text-sm font-bold">{category.name}</h3>
            </div>
            <p className="text-navy dark:text-forest-50 text-xs font-semibold">{category.headline}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2" title={visibilityMeta.tooltip}>
          <Switch
            checked={category.isActive}
            onChange={() => onToggleVisibility(category)}
            disabled={isBusy}
            size="sm"
            ariaLabel={`Toggle visibility for ${category.name}`}
          />
          <span className={cn('text-xs font-semibold whitespace-nowrap', visibilityMeta.textClass)}>
            {visibilityMeta.label}
          </span>
        </div>
      </div>

      {category.description && (
        <p className="text-on-surface-variant dark:text-forest-400 mt-2 line-clamp-2 text-xs leading-relaxed">
          {category.description}
        </p>
      )}

      <div className="dark:border-forest-800 border-outline-variant mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <AdminServiceCategoryGoalCell category={category} sharedPeers={sharedPeers} />
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums',
              category.packageCount > 0
                ? 'dark:bg-forest-850 dark:text-forest-100 bg-slate-100 text-slate-700'
                : 'dark:bg-forest-850/60 dark:text-forest-400 bg-slate-100/60 text-slate-400',
            )}
          >
            {category.packageCount} {category.packageCount === 1 ? 'package' : 'packages'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`${ROUTES.ADMIN_SERVICE_PACKAGES}?categoryId=${category.id}`}
            title={`View packages in ${category.name}`}
            aria-label={`View packages in ${category.name}`}
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 rounded-lg p-1.5 transition"
          >
            <Package className="h-4 w-4" />
          </Link>
          <Link
            href={`${ROUTES.ADMIN_SERVICE_CATEGORIES}/${category.id}/edit`}
            aria-label={`Edit ${category.name}`}
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 rounded-lg p-1.5 transition"
          >
            <SquarePen className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onRequestDelete(category)}
            disabled={category.packageCount > 0 || isBusy}
            aria-label={`Delete ${category.name}`}
            title={
              category.packageCount > 0
                ? `Cannot delete: ${category.packageCount} package(s) still linked to this category`
                : 'Delete category'
            }
            className="text-outline cursor-pointer rounded-lg p-1.5 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AdminServiceCategoriesMobileList({
  categories,
  sharedNeedMap,
  canReorder,
  isReordering,
  busyCategoryId,
  onRequestDelete,
  onToggleVisibility,
  onReorder,
}: AdminServiceCategoriesMobileListProps) {
  const dndId = useId();
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
  );

  const activeCategory = activeId !== null ? (categories.find((item) => item.id === activeId) ?? null) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    onReorder(Number(active.id), Number(over.id));
  };

  return (
    <div className="lg:hidden">
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="space-y-3">
          {categories.map((category) => (
            <SortableMobileCard
              key={category.id}
              category={category}
              sharedPeers={category.needKey ? (sharedNeedMap.get(category.needKey) ?? []) : []}
              canReorder={canReorder}
              isReordering={isReordering}
              isBusy={busyCategoryId === category.id}
              activeId={activeId}
              onRequestDelete={onRequestDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCategory && (
            <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-xs shadow-lg">
              <GripVertical className="text-outline h-4 w-4 shrink-0" />
              <span className="text-primary font-bold">{activeCategory.name}</span>
              <span className="text-navy dark:text-forest-100 truncate font-medium">{activeCategory.headline}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
