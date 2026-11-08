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
    return <Check className="text-primary h-5 w-5 stroke-[2.5]" />;
  }

  if (value === false || value === undefined) {
    return <span className="bg-surface-container-high h-0.5 w-4 rounded-full" />;
  }

  if (typeof value === 'string') {
    return (
      <span
        className={cn(
          'text-sm',
          isSpecialRow && 'text-sm',
          isHighlight ? 'text-primary font-bold' : 'text-on-surface font-medium',
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
          <div className="border-outline-variant w-80 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-xs">
            <div className="border-outline-variant bg-surface-container-low text-on-surface flex h-20 items-center border-b px-5 text-base font-bold">
              Account type
            </div>

            <ul className="divide-outline-variant text-on-surface divide-y text-sm">
              {features.map((feature) => (
                <li
                  key={feature.id}
                  className={cn(
                    'flex items-center px-5 font-normal',
                    feature.isSpecialRow ? 'h-20 justify-between border-y border-emerald-100 bg-emerald-50/50' : 'h-12',
                  )}
                >
                  <div>
                    <span className="text-on-surface">{feature.name}</span>
                    {feature.subText && (
                      <span className="text-on-surface-variant ml-1 block text-xs sm:inline">{feature.subText}</span>
                    )}
                  </div>

                  {feature.badge && (
                    <div className="bg-primary flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>{feature.badge}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-outline-variant bg-surface-container-low text-on-surface-variant flex h-28 items-center border-t px-5 text-xs">
              Choose the plan that fits your job search goals
            </div>
          </div>

          {plans.map((plan) => {
            const isHighlight = plan.isHighlight;
            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={cn(
                  'shrink-0 overflow-hidden rounded-2xl bg-white text-center transition',
                  isHighlight
                    ? 'shadow-elevation-2 relative w-48 border-2 border-amber-400 shadow-amber-500/10'
                    : 'border-outline-variant hover:border-outline w-44 border shadow-xs',
                  isPro && 'border-primary/30 shadow-elevation-1 shadow-emerald-500/5',
                )}
              >
                <div
                  className={cn(
                    'border-outline-variant flex h-20 flex-col items-center justify-center border-b px-2',
                    isHighlight ? 'bg-amber-50/40' : isPro ? 'bg-emerald-50/40' : 'bg-white',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isHighlight ? 'text-amber-800' : isPro ? 'text-primary' : 'text-on-surface-variant',
                      )}
                    >
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-xs font-bold text-white',
                          isHighlight ? 'bg-amber-500' : 'bg-primary',
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
                          ? 'text-primary text-base sm:text-lg'
                          : 'text-on-surface text-base',
                    )}
                  >
                    {plan.priceText}
                  </span>
                </div>

                <ul className="divide-outline-variant divide-y text-sm">
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

                <div
                  className={cn(
                    'border-outline-variant flex h-28 items-center justify-center border-t p-3 text-center',
                    isHighlight ? 'bg-amber-50/20' : 'bg-surface-container-low',
                  )}
                >
                  {plan.buttonActionType === 'upgrade' ? (
                    <Button
                      variant={isHighlight ? 'primary' : 'primary'}
                      onClick={() => onSelectPlan(plan.id as 'pro' | 'premium')}
                      className={cn(
                        'shadow-elevation-1 w-full py-2.5 text-sm font-bold',
                        isHighlight && 'bg-primary shadow-amber-500/25',
                      )}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : plan.buttonActionType === 'link' ? (
                    <div className="text-on-surface-variant text-xs leading-tight">
                      <p>{plan.footerNote}</p>
                      {plan.buttonLink && (
                        <Link
                          href={plan.buttonLink}
                          className="text-primary mt-1 inline-block font-bold hover:underline"
                        >
                          {plan.buttonText}
                        </Link>
                      )}
                    </div>
                  ) : (
                    <span className="text-outline text-xs">{plan.footerNote || 'Default plan'}</span>
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
