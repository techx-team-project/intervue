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
      <legend className="text-[13px] font-semibold text-slate-700">
        Permissions <span className="font-normal text-slate-400">({selected.length} granted)</span>
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
                isSelected ? 'border-primary/40 bg-primary/5' : 'border-slate-200 hover:bg-slate-50',
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(permission)}
                className="accent-primary mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300"
              />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-slate-800">{meta.label}</span>
                <span className="mt-0.5 block text-[11.5px] text-slate-500">{meta.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </fieldset>
  );
}
