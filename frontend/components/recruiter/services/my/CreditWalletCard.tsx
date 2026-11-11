'use client';

import ConvertCreditsModal from '@/components/recruiter/services/my/ConvertCreditsModal';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useConvertCredits, useCreditLedger, useCreditWallet } from '@/hooks/useCredits';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { ChevronDown, ChevronUp, Coins } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreditWalletCard({ onConverted }: { onConverted: (message: string) => void }) {
  const wallet = useCreditWallet();
  const convert = useConvertCredits();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const ledger = useCreditLedger(showLedger);

  if (wallet.isPending || wallet.isError) return null;

  const { balance, nearestExpiryAt, prices } = wallet.data;

  return (
    <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
            <Coins className="h-5 w-5 text-amber-600" aria-hidden />
          </span>
          <div>
            <p className="text-on-surface-variant text-xs font-semibold">Ví credits</p>
            <p className="text-on-surface text-2xl font-bold">{balance.toLocaleString('vi-VN')}</p>
            <p className="text-on-surface-variant text-xs">
              {balance === 0
                ? 'Chưa có credits. Mua gói FLEX để dùng linh hoạt các tiện ích.'
                : nearestExpiryAt
                  ? `Hạn dùng đến ${formatDate(nearestExpiryAt)}`
                  : 'Không giới hạn thời gian dùng'}
            </p>
          </div>
        </div>

        {balance > 0 ? (
          <Button size="sm" onClick={() => setIsOpen(true)}>
            Đổi credits lấy tiện ích
          </Button>
        ) : (
          <Link href={ROUTES.RECRUITER_SERVICES} className="text-primary text-sm font-semibold hover:underline">
            Xem gói credits
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowLedger((current) => !current)}
        className="text-on-surface-variant mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
      >
        {showLedger ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        Lịch sử đổi credits
      </button>

      {showLedger && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-dashed border-slate-200">
          {ledger.isPending ? (
            <p className="text-on-surface-variant px-4 py-3 text-xs">Đang tải...</p>
          ) : ledger.isError || !ledger.data || ledger.data.length === 0 ? (
            <p className="text-on-surface-variant px-4 py-3 text-xs">Chưa có giao dịch credits nào.</p>
          ) : (
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {ledger.data.map((entry, index) => (
                  <tr key={`${entry.at}-${index}`}>
                    <td className="text-on-surface-variant px-4 py-2 whitespace-nowrap">{formatDateTime(entry.at)}</td>
                    <td className="text-on-surface px-4 py-2">{entry.label}</td>
                    <td
                      className={`px-4 py-2 text-right font-semibold whitespace-nowrap ${
                        entry.credit ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {entry.credit ? '+' : '−'}
                      {entry.quantity.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ConvertCreditsModal
        isOpen={isOpen}
        balance={balance}
        prices={prices}
        onClose={() => {
          setIsOpen(false);
          setError(null);
        }}
        isBusy={convert.isPending}
        error={error}
        onConfirm={(price, quantity) =>
          convert.mutate(
            { entitlementType: price.entitlementType, tier: price.tier, quantity },
            {
              onSuccess: () => {
                setIsOpen(false);
                setError(null);
                onConverted(`Đã đổi credits lấy ${quantity} × ${price.label}.`);
              },
              onError: (cause) => setError(getErrorMessage(cause)),
            },
          )
        }
      />
    </section>
  );
}
