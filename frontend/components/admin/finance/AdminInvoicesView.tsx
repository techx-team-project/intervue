'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { Button } from '@/components/ui/Button';
import type { AdminInvoice } from '@/types/admin-payment';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, FileDown } from 'lucide-react';
import { useState } from 'react';

export default function AdminInvoicesView({ invoices }: { invoices: AdminInvoice[] }) {
  const [error, setError] = useState<string | null>(null);

  const open = async (id: number) => {
    setError(null);
    try {
      const blob = await adminPaymentApi.invoicePdf(id);
      window.open(URL.createObjectURL(blob), '_blank', 'noopener');
    } catch (cause) {
      setError(getErrorMessage(cause));
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <div>
        <h1 className="text-on-surface text-xl font-bold">Invoices</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          One document per paid order. These are internal records, not e-invoices carrying a tax authority code.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      <div className="border-outline-variant overflow-x-auto rounded-2xl border bg-white shadow-2xs">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-outline-variant text-on-surface-variant border-b text-xs">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Number</th>
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Buyer</th>
              <th className="px-4 py-3 text-left font-semibold">Issued</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-on-surface-variant px-4 py-10 text-center text-xs">
                  No invoice has been issued yet.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-outline-variant border-b last:border-0">
                  <td className="text-on-surface px-4 py-3 font-semibold">{invoice.number}</td>
                  <td className="text-on-surface-variant px-4 py-3">{invoice.orderCode}</td>
                  <td className="px-4 py-3">
                    <p className="text-on-surface">{invoice.buyerName}</p>
                    <p className="text-on-surface-variant text-xs">
                      {invoice.invoiceType === 'BUSINESS' ? (invoice.buyerTaxId ?? '—') : invoice.recipientEmail}
                    </p>
                  </td>
                  <td className="text-on-surface-variant px-4 py-3 text-xs">{formatDateTime(invoice.issuedAt)}</td>
                  <td className="text-on-surface px-4 py-3 text-right font-semibold">
                    {invoice.totalAmount.toLocaleString('vi-VN')} {invoice.currency}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="neutral" onClick={() => open(invoice.id)}>
                      <FileDown className="h-4 w-4" aria-hidden />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
