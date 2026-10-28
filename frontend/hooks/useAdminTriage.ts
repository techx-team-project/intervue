'use client';

import { WORK_ITEM_KIND_LABEL } from '@/constants/admin-work';
import type { RejectWorkItemFormData } from '@/schemas/admin.schema';
import type { AdminWorkItem } from '@/types/admin';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useAdminTriage(initialItems: AdminWorkItem[]) {
  const [items, setItems] = useState(initialItems);
  const [rejectTarget, setRejectTarget] = useState<AdminWorkItem | null>(null);

  const resolve = useCallback(
    (item: AdminWorkItem, message: string) => {
      const snapshot = items;
      setItems((previous) => previous.filter((entry) => entry.id !== item.id));
      toast.success(message, {
        action: { label: 'Undo', onClick: () => setItems(snapshot) },
      });
    },
    [items],
  );

  const approve = useCallback(
    (item: AdminWorkItem) => {
      resolve(item, `${WORK_ITEM_KIND_LABEL[item.kind]} approved — ${item.subject}`);
    },
    [resolve],
  );

  const confirmReject = useCallback(
    (data: RejectWorkItemFormData) => {
      if (!rejectTarget) return;
      const target = rejectTarget;
      setRejectTarget(null);
      resolve(target, `${WORK_ITEM_KIND_LABEL[target.kind]} rejected — ${data.reason}`);
    },
    [rejectTarget, resolve],
  );

  return {
    items,
    approve,
    rejectTarget,
    requestReject: setRejectTarget,
    closeReject: () => setRejectTarget(null),
    confirmReject,
  };
}
