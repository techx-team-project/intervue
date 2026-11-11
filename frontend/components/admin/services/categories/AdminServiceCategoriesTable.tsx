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

interface AdminServiceCategoriesTableProps {
  categories: AdminServiceCategory[];
  sharedNeedMap: Map<string, AdminServiceCategory[]>;
  canReorder: boolean;
  isReordering: boolean;
  busyCategoryId: number | null;
  onRequestDelete: (category: AdminServiceCategory) => void;
  onToggleVisibility: (category: AdminServiceCategory) => void;
  onReorder: (activeId: number, overId: number) => void;
}

interface SortableCategoryRowProps {
  category: AdminServiceCategory;
  sharedPeers: AdminServiceCategory[];
  canReorder: boolean;
  isReordering: boolean;
  isBusy: boolean;
  activeId: number | null;
  activeIndex: number;
  rowIndex: number;
  onRequestDelete: (category: AdminServiceCategory) => void;
  onToggleVisibility: (category: AdminServiceCategory) => void;
}

function SortableCategoryRow({
  category,
  sharedPeers,
  canReorder,
  isReordering,
  isBusy,
  activeId,
  activeIndex,
  rowIndex,
  onRequestDelete,
  onToggleVisibility,
}: SortableCategoryRowProps) {
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

  const setRowRef = (element: HTMLTableRowElement | null) => {
    setDragNodeRef(element);
    setDropNodeRef(element);
  };

  const showDropLine = isOver && activeId !== null && activeId !== category.id;
  const movingUp = activeIndex > rowIndex;
  const visibilityMeta = CATEGORY_VISIBILITY_META[getCategoryVisibilityState(category)];

  return (
    <tr
      ref={setRowRef}
      className={cn(
        'dark:hover:bg-forest-850/40 hover:bg-surface-container-low/70 transition-colors',
        !category.isActive && 'dark:bg-forest-950/30 bg-slate-50/50',
        isDragging && 'bg-surface-container-low/50 opacity-40',
        showDropLine &&
          (movingUp
            ? 'shadow-[inset_0_2px_0_0_#64748b] dark:shadow-[inset_0_2px_0_0_#94a3b8]'
            : 'shadow-[inset_0_-2px_0_0_#64748b] dark:shadow-[inset_0_-2px_0_0_#94a3b8]'),
      )}
    >
      <td className="py-4 pr-3 pl-4 align-middle">
        <div className="flex items-center gap-2">
          <button
            ref={setActivatorNodeRef}
            type="button"
            disabled={dragDisabled}
            title={canReorder ? 'Drag to reorder' : 'Clear search and filters to reorder'}
            aria-label={`Drag to reorder ${category.name}`}
            {...(dragDisabled ? {} : attributes)}
            {...(dragDisabled ? {} : listeners)}
            className="text-outline hover:bg-surface-container-high hover:text-navy dark:text-forest-400 dark:hover:bg-forest-800 dark:hover:text-forest-100 cursor-grab touch-none rounded-lg p-1.5 transition active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <span className="dark:bg-forest-850 dark:text-forest-100 bg-surface-container-low text-navy inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 font-mono text-xs font-semibold tabular-nums">
            {category.displayOrder}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="max-w-md space-y-1">
          <p className="text-primary text-sm font-bold">{category.name}</p>
          <p className="text-navy dark:text-forest-50 text-xs font-semibold">{category.headline}</p>
          {category.description && (
            <p className="text-on-surface-variant dark:text-forest-400 line-clamp-1 text-xs">{category.description}</p>
          )}
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <AdminServiceCategoryGoalCell category={category} sharedPeers={sharedPeers} />
      </td>

      <td className="px-4 py-4 align-middle">
        <span
          title={
            category.packageCount > 0
              ? `${category.activePackageCount} active of ${category.packageCount} total package(s)`
              : 'No packages yet'
          }
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tabular-nums',
            category.packageCount > 0
              ? 'dark:bg-forest-850 dark:text-forest-100 bg-slate-100 text-slate-700'
              : 'dark:bg-forest-850/60 dark:text-forest-400 bg-slate-100/60 text-slate-400',
          )}
        >
          {category.packageCount} {category.packageCount === 1 ? 'package' : 'packages'}
        </span>
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="inline-flex items-center gap-2.5" title={visibilityMeta.tooltip}>
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
      </td>

      <td className="py-4 pr-5 pl-4 text-right align-middle">
        <div className="inline-flex items-center justify-end gap-1">
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
            title="Edit category"
            aria-label={`Edit ${category.name}`}
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 rounded-lg p-1.5 transition"
          >
            <SquarePen className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onRequestDelete(category)}
            disabled={category.packageCount > 0 || isBusy}
            title={
              category.packageCount > 0
                ? `Cannot delete: ${category.packageCount} package(s) still linked to this category`
                : 'Delete category'
            }
            aria-label={`Delete ${category.name}`}
            className="text-outline disabled:hover:text-outline cursor-pointer rounded-lg p-1.5 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent dark:hover:bg-rose-950/50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminServiceCategoriesTable({
  categories,
  sharedNeedMap,
  canReorder,
  isReordering,
  busyCategoryId,
  onRequestDelete,
  onToggleVisibility,
  onReorder,
}: AdminServiceCategoriesTableProps) {
  const dndId = useId();
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
  );

  const activeCategory = activeId !== null ? (categories.find((item) => item.id === activeId) ?? null) : null;
  const activeIndex = activeId !== null ? categories.findIndex((item) => item.id === activeId) : -1;

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
    <div className="hidden lg:block">
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-lg border bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-xs">
              <thead>
                <tr className="dark:border-forest-800 dark:bg-forest-950/60 dark:text-forest-300 border-outline-variant bg-surface-container-low/80 text-on-surface-variant border-b text-[11px] font-bold tracking-wider uppercase">
                  <th className="w-28 py-3.5 pr-3 pl-4">Order</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="w-48 px-4 py-3.5">Suggestion goal</th>
                  <th className="w-32 px-4 py-3.5">Packages</th>
                  <th className="w-44 px-4 py-3.5">Visibility</th>
                  <th className="w-36 py-3.5 pr-5 pl-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="dark:divide-forest-800 divide-outline-variant/75 divide-y">
                {categories.map((category, rowIndex) => (
                  <SortableCategoryRow
                    key={category.id}
                    category={category}
                    sharedPeers={category.needKey ? (sharedNeedMap.get(category.needKey) ?? []) : []}
                    canReorder={canReorder}
                    isReordering={isReordering}
                    isBusy={busyCategoryId === category.id}
                    activeId={activeId}
                    activeIndex={activeIndex}
                    rowIndex={rowIndex}
                    onRequestDelete={onRequestDelete}
                    onToggleVisibility={onToggleVisibility}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DragOverlay>
          {activeCategory && (
            <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-xs shadow-lg">
              <GripVertical className="text-outline h-4 w-4 shrink-0" />
              <span className="dark:bg-forest-850 dark:text-forest-100 bg-surface-container-low text-navy inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 font-mono text-xs font-semibold tabular-nums">
                {activeCategory.displayOrder}
              </span>
              <span className="text-primary font-bold">{activeCategory.name}</span>
              <span className="text-navy dark:text-forest-100 truncate font-medium">{activeCategory.headline}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
