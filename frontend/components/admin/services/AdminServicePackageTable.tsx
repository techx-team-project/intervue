'use client';

import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import type { AdminServicePackage } from '@/types/admin-service-package';
import { Package, SquarePen } from 'lucide-react';
import Link from 'next/link';

interface AdminServicePackageTableProps {
  packages: AdminServicePackage[];
  onToggleActive: (item: AdminServicePackage) => void;
}

const STATUS_STYLE: Record<AdminServicePackage['status'], string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  DRAFT: 'bg-amber-50 text-amber-700',
  INACTIVE: 'bg-neutral-100 text-neutral-600',
};

export default function AdminServicePackageTable({ packages, onToggleActive }: AdminServicePackageTableProps) {
  if (packages.length === 0) {
    return (
      <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center shadow-2xs">
        <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
          <Package className="h-6 w-6" />
        </div>
        <h4 className="text-on-surface mt-3 text-sm font-bold">No service packages found</h4>
        <p className="text-on-surface-variant mt-1 text-xs">Adjust the filters or create a new package.</p>
      </div>
    );
  }

  return (
    <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead>
            <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="py-3.5 pr-4 pl-6">Package</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5 text-right">Price</th>
              <th className="px-4 py-3.5 text-center">Benefits</th>
              <th className="px-4 py-3.5 text-center">Sections</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-center">Active</th>
              <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-outline-variant divide-y">
            {packages.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 pr-4 pl-6">
                  <p className="text-on-surface font-bold">{item.name}</p>
                  <p className="text-on-surface-variant font-mono text-[11px]">{item.code}</p>
                </td>
                <td className="text-on-surface-variant px-4 py-3.5">{item.categoryCode}</td>
                <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                  {new Intl.NumberFormat('en-US').format(item.price)} {item.currency}
                </td>
                <td className="text-on-surface-variant px-4 py-3.5 text-center">{item.benefits.length}</td>
                <td className="text-on-surface-variant px-4 py-3.5 text-center">{item.sections.length}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-center">
                    <Switch
                      checked={item.status === 'ACTIVE'}
                      onChange={() => onToggleActive(item)}
                      ariaLabel={`Toggle ${item.name}`}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="py-3.5 pr-6 pl-4 text-right">
                  <Link
                    href={`${ROUTES.ADMIN_SERVICE_PACKAGES}/${item.id}/edit`}
                    className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    <SquarePen className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
