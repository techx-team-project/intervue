'use client';

import { ADMIN_PERMISSION_META, ADMIN_PERMISSION_ORDER } from '@/constants/admin-user';
import { cn } from '@/lib/utils';
import type { AdminPermission } from '@/types/admin';

interface AdminPermissionPickerProps {
  selected: AdminPermission[];
  error?: string;
  onToggle: (permission: AdminPermission) => void;
}

export default function AdminPermissionPicker({ selected, error, onToggle }: AdminPermissionPickerProps) {
  return (
    <fieldset>
      <legend className="text-body-md text-on-surface font-semibold">
        Permissions <span className="text-outline font-normal">({selected.length} granted)</span>
      </legend>

      <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {ADMIN_PERMISSION_ORDER.map((permission) => {
          const meta = ADMIN_PERMISSION_META[permission];
          const isSelected = selected.includes(permission);

          return (
            <label
              key={permission}
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 transition-colors',
                isSelected ? 'border-primary/40 bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low',
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(permission)}
                className="accent-primary border-outline mt-0.5 h-4 w-4 cursor-pointer rounded"
              />
              <span className="min-w-0">
                <span className="text-body-md text-on-surface block font-semibold">{meta.label}</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5 block">{meta.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </fieldset>
  );
}
