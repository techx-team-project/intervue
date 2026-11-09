'use client';

import Spinner from '@/components/common/Spinner';
import ActivateEntitlementModal from '@/components/recruiter/services/my/ActivateEntitlementModal';
import { ROUTES } from '@/constants/routes';
import { useActivateEntitlement, useActiveEntitlements, useEntitlementStock } from '@/hooks/useEntitlements';
import { cn } from '@/lib/utils';
import type { Entitlement } from '@/types/entitlement';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, PackageOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Tab = 'stock' | 'active';

export default function MyServicesView() {
  const stock = useEntitlementStock();
  const active = useActiveEntitlements();
  const activate = useActivateEntitlement();

  const [tab, setTab] = useState<Tab>('stock');
  const [target, setTarget] = useState<Entitlement | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (stock.isPending || active.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (stock.isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        {getErrorMessage(stock.error)}
      </div>
    );
  }

  const available = (stock.data ?? []).filter((item) => item.status === 'AVAILABLE');
  const running = active.data ?? [];

  return (
    <div className="space-y-5 pb-16">
      <div className="border-outline-variant flex gap-1 border-b">
        {(
          [
            ['stock', `Trong kho (${available.length})`],
            ['active', `Đang chạy (${running.length})`],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              '-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-sm font-semibold transition',
              tab === key
                ? 'border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          <Check className="h-4 w-4 text-emerald-600" />
          {notice}
        </div>
      )}

      {tab === 'stock' &&
        (available.length === 0 ? (
          <EmptyState
            title="Kho dịch vụ đang trống"
            hint="Dịch vụ sẽ xuất hiện ở đây ngay sau khi đơn hàng được thanh toán."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {available.map((item) => (
              <article key={item.id} className="border-outline-variant rounded-xl border bg-white p-4 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-on-surface font-bold">{item.label}</p>
                    <p className="text-on-surface-variant mt-0.5 text-xs">
                      Còn {item.remainingQuantity} / {item.totalQuantity}
                      {item.durationDays ? ` · hiệu lực ${item.durationDays} ngày` : ''}
                    </p>
                  </div>
                  <span className="text-on-surface-variant shrink-0 text-xs">
                    Hạn kích hoạt {new Date(item.activationDeadline).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {item.activatable ? (
                  <button
                    type="button"
                    onClick={() => {
                      setModalError(null);
                      setTarget(item);
                    }}
                    className="border-primary text-primary mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border bg-white text-sm font-semibold transition hover:bg-emerald-50"
                  >
                    Áp dụng cho tin
                  </button>
                ) : (
                  <p className="text-on-surface-variant mt-4 text-xs">
                    Dịch vụ này được trừ tự động khi bạn sử dụng tính năng tương ứng.
                  </p>
                )}
              </article>
            ))}
          </div>
        ))}

      {tab === 'active' &&
        (running.length === 0 ? (
          <EmptyState title="Chưa có dịch vụ nào đang chạy" hint="Áp dụng một dịch vụ trong kho để bắt đầu." />
        ) : (
          <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                  <th className="py-3 pr-4 pl-5">Dịch vụ</th>
                  <th className="px-4 py-3">Tin áp dụng</th>
                  <th className="px-4 py-3">Bắt đầu</th>
                  <th className="py-3 pr-5 pl-4">Kết thúc</th>
                </tr>
              </thead>
              <tbody className="divide-outline-variant divide-y">
                {running.map((usage) => (
                  <tr key={usage.id}>
                    <td className="text-on-surface py-3 pr-4 pl-5 font-semibold">{usage.label}</td>
                    <td className="px-4 py-3">
                      {usage.jobId ? (
                        <Link
                          href={`${ROUTES.RECRUITER_JOBS}/${usage.jobId}/edit`}
                          className="text-primary font-semibold hover:underline"
                        >
                          #{usage.jobId}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3">
                      {new Date(usage.startedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="text-on-surface-variant py-3 pr-5 pl-4">
                      {usage.endsAt ? new Date(usage.endsAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <ActivateEntitlementModal
        entitlement={target}
        onClose={() => setTarget(null)}
        isBusy={activate.isPending}
        error={modalError}
        onConfirm={(jobId) =>
          activate.mutate(
            { id: target?.id ?? 0, jobId },
            {
              onSuccess: () => {
                setTarget(null);
                setNotice('Đã áp dụng dịch vụ cho tin tuyển dụng.');
              },
              onError: (cause) => setModalError(getErrorMessage(cause)),
            },
          )
        }
      />
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
      <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
        <PackageOpen className="h-6 w-6" />
      </div>
      <h4 className="text-on-surface mt-3 text-sm font-bold">{title}</h4>
      <p className="text-on-surface-variant mt-1 text-xs">{hint}</p>
      <Link
        href={ROUTES.RECRUITER_SERVICES}
        className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Xem các gói dịch vụ
      </Link>
    </div>
  );
}
