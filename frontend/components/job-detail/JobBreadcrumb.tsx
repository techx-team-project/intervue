'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface JobBreadcrumbProps {
  title: string;
  category?: string;
  onReport?: () => void;
}

export default function JobBreadcrumb({
  title,
  category = 'Kế toán / Kiểm toán / Thuế',
  onReport,
}: JobBreadcrumbProps) {
  const items = [{ label: 'Tìm việc làm', href: '/#feature-jobs' }, { label: category }, { label: title }];

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <Breadcrumb items={items} showHome className="text-xs" />

      <button
        type="button"
        onClick={onReport}
        className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-rose-600"
        title="Báo cáo tin tuyển dụng không chính xác"
      >
        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
        <span>Báo cáo tin này</span>
      </button>
    </div>
  );
}
