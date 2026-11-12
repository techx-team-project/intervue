'use client';

import type { RevenueReport } from '@/types/admin-payment';
import { Banknote, RotateCcw, Timer, Wallet } from 'lucide-react';

function money(amount: number) {
  return `${amount.toLocaleString('vi-VN')} VND`;
}

function Card({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Wallet;
  tone: string;
}) {
  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${tone}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-on-surface-variant text-xs font-semibold">{label}</p>
      </div>
      <p className="text-on-surface mt-3 text-xl font-bold">{value}</p>
      <p className="text-on-surface-variant mt-1 text-xs">{hint}</p>
    </div>
  );
}

export default function AdminRevenueView({ report }: { report: RevenueReport }) {
  const statuses = Object.entries(report.ordersByStatus).filter(([, count]) => count > 0);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-on-surface text-xl font-bold">Revenue</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Counted from the orders table at the moment this page loaded. Nothing here is estimated or projected.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          label="Collected"
          value={money(report.collectedTotal)}
          hint={`${report.paidOrderCount} order(s) received money`}
          icon={Banknote}
          tone="bg-emerald-50 text-emerald-700"
        />
        <Card
          label="Refunded"
          value={money(report.refundedTotal)}
          hint="Approved refund amounts"
          icon={RotateCcw}
          tone="bg-amber-50 text-amber-700"
        />
        <Card
          label="Net held"
          value={money(report.netTotal)}
          hint="Collected minus refunded"
          icon={Wallet}
          tone="bg-sky-50 text-sky-700"
        />
        <Card
          label="Awaiting payment"
          value={money(report.pendingTotal)}
          hint="Still owed on open orders"
          icon={Timer}
          tone="bg-slate-100 text-slate-600"
        />
      </div>

      <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
        <h2 className="text-on-surface text-sm font-bold">Orders by status</h2>
        {statuses.length === 0 ? (
          <p className="text-on-surface-variant mt-3 text-xs">No order has been placed yet.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {statuses.map(([status, count]) => (
              <li
                key={status}
                className="border-outline-variant text-on-surface-variant rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {status} · {count}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
          <h2 className="text-on-surface text-sm font-bold">By month</h2>
          {report.byMonth.length === 0 ? (
            <p className="text-on-surface-variant mt-3 text-xs">No money has been collected yet.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody>
                {report.byMonth.map((row) => (
                  <tr key={row.month} className="border-outline-variant border-b last:border-0">
                    <td className="text-on-surface py-2 font-semibold">{row.month}</td>
                    <td className="text-on-surface-variant py-2 text-xs">{row.orderCount} order(s)</td>
                    <td className="text-on-surface py-2 text-right font-semibold">{money(row.collected)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
          <h2 className="text-on-surface text-sm font-bold">By package</h2>
          {report.byPackage.length === 0 ? (
            <p className="text-on-surface-variant mt-3 text-xs">No package has been sold yet.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody>
                {report.byPackage.map((row) => (
                  <tr key={row.packageName} className="border-outline-variant border-b last:border-0">
                    <td className="py-2">
                      <p className="text-on-surface font-semibold">{row.packageName}</p>
                    </td>
                    <td className="text-on-surface-variant py-2 text-xs">×{row.quantity}</td>
                    <td className="text-on-surface py-2 text-right font-semibold">{money(row.collected)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
