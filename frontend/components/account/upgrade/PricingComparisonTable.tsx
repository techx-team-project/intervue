'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { PlanFeature, PricingPlan, FeatureValueType } from '@/types/upgrade';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PricingComparisonTableProps {
  features: PlanFeature[];
  plans: PricingPlan[];
  onSelectPlan: (planId: 'pro' | 'premium') => void;
}

function FeatureValueCell({
  value,
  isSpecialRow,
  isHighlight,
}: {
  value: FeatureValueType | undefined;
  isSpecialRow?: boolean;
  isHighlight?: boolean;
}) {
  if (value === true) {
    return <Check className="h-5 w-5 stroke-[2.5] text-emerald-600" />;
  }

  if (value === false || value === undefined) {
    return <span className="h-0.5 w-4 rounded-full bg-slate-200" />;
  }

  if (typeof value === 'string') {
    return (
      <span
        className={cn(
          'text-sm',
          isSpecialRow && 'text-sm',
          isHighlight ? 'font-bold text-emerald-600' : 'font-medium text-slate-800',
        )}
      >
        {value}
      </span>
    );
  }

  return <span>{value.text}</span>;
}

export function PricingComparisonTable({ features, plans, onSelectPlan }: PricingComparisonTableProps) {
  return (
    <div className="w-full bg-white px-2 py-10 sm:px-4">
      <div className="mx-auto max-w-7xl overflow-x-auto pb-4">
        <div className="flex min-w-6xl items-start justify-center gap-2">
          {/* ================= CỘT 1: DANH MỤC TÍNH NĂNG ================= */}
          <div className="w-80 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex h-20 items-center border-b border-slate-200 bg-slate-50 px-5 text-base font-bold text-slate-800">
              Loại tài khoản
            </div>

            <ul className="divide-y divide-slate-200 text-sm text-slate-700">
              {features.map((feature) => (
                <li
                  key={feature.id}
                  className={cn(
                    'flex items-center px-5 font-normal',
                    feature.isSpecialRow ? 'h-20 justify-between border-y border-emerald-100 bg-emerald-50/50' : 'h-12',
                  )}
                >
                  <div>
                    <span className="text-slate-800">{feature.name}</span>
                    {feature.subText && (
                      <span className="ml-1 block text-xs text-slate-500 sm:inline">{feature.subText}</span>
                    )}
                  </div>

                  {feature.badge && (
                    <div className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>{feature.badge}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex h-28 items-center border-t border-slate-200 bg-slate-50 px-5 text-xs text-slate-500">
              Chọn gói phù hợp với mục tiêu ứng tuyển
            </div>
          </div>

          {/* ================= CỘT 2-6: CÁC GÓI DỊCH VỤ ================= */}
          {plans.map((plan) => {
            const isHighlight = plan.isHighlight;
            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={cn(
                  'shrink-0 overflow-hidden rounded-2xl bg-white text-center transition-all',
                  isHighlight
                    ? 'relative w-48 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'w-44 border border-slate-200 shadow-xs hover:border-slate-300',
                  isPro && 'border-emerald-200 shadow-md shadow-emerald-500/5',
                )}
              >
                {/* Header Cột */}
                <div
                  className={cn(
                    'flex h-20 flex-col items-center justify-center border-b border-slate-200 px-2',
                    isHighlight ? 'bg-amber-50/40' : isPro ? 'bg-emerald-50/40' : 'bg-white',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isHighlight ? 'text-amber-800' : isPro ? 'text-emerald-700' : 'text-slate-500',
                      )}
                    >
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-xs font-bold text-white',
                          isHighlight ? 'bg-amber-500' : 'bg-emerald-600',
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-1 font-bold',
                      isHighlight
                        ? 'text-base text-amber-700 sm:text-lg'
                        : isPro
                          ? 'text-base text-emerald-600 sm:text-lg'
                          : 'text-base text-slate-800',
                    )}
                  >
                    {plan.priceText}
                  </span>
                </div>

                {/* Danh sách quyền lợi */}
                <ul className="divide-y divide-slate-200 text-sm">
                  {features.map((feature) => (
                    <li
                      key={feature.id}
                      className={cn(
                        'flex items-center justify-center px-2',
                        feature.isSpecialRow ? 'h-20 border-y border-emerald-100 bg-emerald-50/50' : 'h-12',
                        isHighlight && 'bg-amber-50/5',
                      )}
                    >
                      <FeatureValueCell
                        value={plan.featureValues[feature.id]}
                        isSpecialRow={feature.isSpecialRow}
                        isHighlight={isHighlight || isPro}
                      />
                    </li>
                  ))}
                </ul>

                {/* Footer Cột & CTA */}
                <div
                  className={cn(
                    'flex h-28 items-center justify-center border-t border-slate-200 p-3 text-center',
                    isHighlight ? 'bg-amber-50/20' : 'bg-slate-50',
                  )}
                >
                  {plan.buttonActionType === 'upgrade' ? (
                    <Button
                      variant={isHighlight ? 'primary' : 'primary'}
                      onClick={() => onSelectPlan(plan.id as 'pro' | 'premium')}
                      className={cn(
                        'w-full py-2.5 text-sm font-bold shadow-md',
                        isHighlight &&
                          'bg-linear-to-r from-amber-500 to-amber-600 shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700',
                      )}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : plan.buttonActionType === 'link' ? (
                    <div className="text-xs leading-tight text-slate-500">
                      <p>{plan.footerNote}</p>
                      {plan.buttonLink && (
                        <Link
                          href={plan.buttonLink}
                          className="mt-1 inline-block font-bold text-emerald-600 hover:underline"
                        >
                          {plan.buttonText}
                        </Link>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">{plan.footerNote || 'Gói mặc định'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PricingComparisonTable;
