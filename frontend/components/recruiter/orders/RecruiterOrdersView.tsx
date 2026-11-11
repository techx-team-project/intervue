'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { ORDER_CANCELLABLE, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from '@/constants/recruiter-order';
import { ROUTES } from '@/constants/routes';
import { useRecruiterOrderList, useRecruiterOrderMutations } from '@/hooks/useRecruiterOrders';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RecruiterOrdersView() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, error } = useRecruiterOrderList(page);
  const { cancel } = useRecruiterOrderMutations();
  const [actionError, setActionError] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        {getErrorMessage(error)}
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
        <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
          <Receipt className="h-6 w-6" />
        </div>
        <h4 className="text-on-surface mt-3 text-sm font-bold">Chưa có đơn hàng nào</h4>
        <Link
          href={ROUTES.RECRUITER_SERVICES}
          className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Xem các gói dịch vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {actionError}
        </div>
      )}

      <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                <th className="py-3.5 pr-4 pl-6">Mã đơn</th>
                <th className="px-4 py-3.5 text-center">Số dịch vụ</th>
                <th className="px-4 py-3.5 text-right">Tổng tiền</th>
                <th className="px-4 py-3.5 text-center">Trạng thái</th>
                <th className="px-4 py-3.5">Ngày tạo</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {data.items.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 pr-4 pl-6">
                    <Link
                      href={`${ROUTES.RECRUITER_ORDERS}/${order.code}`}
                      className="text-primary font-mono font-bold hover:underline"
                    >
                      {order.code}
                    </Link>
                  </td>
                  <td className="text-on-surface-variant px-4 py-3.5 text-center">{order.itemCount}</td>
                  <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                    {formatServicePrice(order.totalAmount, order.currency)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_STYLE[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td className="text-on-surface-variant px-4 py-3.5">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3.5 pr-6 pl-4 text-right">
                    {ORDER_CANCELLABLE.includes(order.status) && (
                      <button
                        type="button"
                        disabled={cancel.isPending}
                        onClick={() => {
                          setActionError(null);
                          cancel.mutate(order.code, {
                            onError: (cause) => setActionError(getErrorMessage(cause)),
                          });
                        }}
                        className="cursor-pointer text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
                      >
                        Huỷ đơn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.totalPages > 1 && (
        <Pagination
          page={data.page + 1}
          pageCount={data.totalPages}
          totalItems={data.totalItems}
          pageSize={data.size}
          onPageChange={(next) => setPage(next - 1)}
        />
      )}
    </div>
  );
}
